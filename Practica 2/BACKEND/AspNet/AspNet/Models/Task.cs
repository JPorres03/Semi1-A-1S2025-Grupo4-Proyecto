using System;
using System.Collections.Generic;

namespace AspNet.Models;

public partial class Task
{
    public int Id { get; set; }

    public int IdUser { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null;

    public bool? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User? IdUserNavigation { get; set; }
}
