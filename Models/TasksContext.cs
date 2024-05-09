using Microsoft.EntityFrameworkCore;

namespace TranTrongNhan.Models
{
    public class TasksContext : DbContext
    {
        public DbSet<Tasks> tasks { get; set; }
        public TasksContext(DbContextOptions<TasksContext> options) : base(options) { }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("name=Default");
        }
    }
}