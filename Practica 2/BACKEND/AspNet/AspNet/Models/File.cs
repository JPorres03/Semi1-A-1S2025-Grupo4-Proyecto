using System;
using System.Collections.Generic;

namespace AspNet.Models;

public partial class File
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Url { get; set; } = null!;

    public virtual User? User { get; set; }
}
