﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Domain.Entities
{
    public class Image
    {
        [Key]
        public Guid Id { get; set; }

        public string FilePath { get; set; } = default!;

        public string? Author { get; set; }

        [ForeignKey("Wedding")]
        public Guid WeddingId { get; set; }
        public Wedding Wedding { get; set; }
    }
}
