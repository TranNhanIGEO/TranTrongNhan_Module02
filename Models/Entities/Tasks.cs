using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TranTrongNhan.Models.Entities
{
    [Table("Tasks")]
    public class Tasks
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public int Priority { get; set; }
        public string Status { get; set; } = null!;
        public string Note { get; set; } = null!;
        public bool IsActive { get; set; }
    }
}
