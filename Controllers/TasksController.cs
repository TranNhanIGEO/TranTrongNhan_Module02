using Microsoft.AspNetCore.Mvc;
using TranTrongNhan.Models;
using Microsoft.EntityFrameworkCore;

namespace TranTrongNhan.Controllers
{
    public class TasksController : Controller
    {
        private readonly TasksContext _dbContext;

        public TasksController(TasksContext dbContext)
        {
            _dbContext = dbContext;
        }

		public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks(string? status)
        {
            try
            {
                var data = from t in _dbContext.tasks
                           select t;
                List<Tasks> _tasks;
                if (status == "all") {
                    _tasks = await data.ToListAsync();
                }
                else {
                    _tasks = await data.Where(t => t.Status == status).ToListAsync();
                }
                return Ok(_tasks);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetTaskById(string id)
        {
            try
            {
                var data = await _dbContext.tasks.FirstOrDefaultAsync(t => t.Id == Guid.Parse(id));
                if (data == null) return NotFound();
                return Ok(data);
            }
            catch
            {
                return BadRequest();
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> AddTask(Tasks task)
        {
            try
            {
                var data = new Tasks();
                data.Id = Guid.NewGuid();
                data.Name = task.Name;
                data.Priority = task.Priority;
                data.Status = task.Status;
                data.Note = task.Note;
                await _dbContext.AddAsync(data);
                await _dbContext.SaveChangesAsync();
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut]
        public async Task<IActionResult> EditTask(string id, Tasks task)
        {
            try
            {
                var data = await _dbContext.tasks.FirstOrDefaultAsync(t => t.Id == Guid.Parse(id));
                if (data == null) return NotFound();
                data.Name = task.Name;
                data.Priority = task.Priority;
                data.Status = task.Status;
                data.Note = task.Note;
                _dbContext.Update(data);
                await _dbContext.SaveChangesAsync();
                return Ok(data);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTask(string id)
        {
            try
            {
                var data = await _dbContext.tasks.FirstOrDefaultAsync(t => t.Id == Guid.Parse(id));
                if (data == null) return NotFound();
                _dbContext.Remove(data);
                await _dbContext.SaveChangesAsync();
                return Ok(data);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
