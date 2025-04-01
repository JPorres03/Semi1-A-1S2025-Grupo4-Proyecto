using System.ComponentModel.DataAnnotations;

namespace AspNet.DTOs
{
    public class UpdatePhotoDTO
    {
        [Required]
        public string Profile_picture_url { get; set; } = null!;
    }
}
