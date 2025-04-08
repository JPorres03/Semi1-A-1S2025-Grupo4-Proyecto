using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AspNet.Models;

public partial class File
{
    [JsonPropertyName("file_id")]
    public int Id { get; set; }
    [JsonPropertyName("file_user_id")]
    public int UserId { get; set; }

    [JsonPropertyName("file_url")]
    public string Url { get; set; } = null!;

    public virtual User? User { get; set; }
}
