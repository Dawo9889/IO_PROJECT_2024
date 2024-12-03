﻿using Backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Backend.Domain.Entities
{
    public class Wedding
    {
        [Key]
        public Guid Id { get; set; }
        [MaxLength(50)]
        public string Name { get; set; } = default!;

        public DateOnly EventDate { get; set; } = default!;

        [MaxLength(200)]
        public string Description { get; set; } = default!;

        public Guid SessionKey { get; set; } = Guid.NewGuid();

        // Data wygaśnięcia klucza sesji
        public DateTime SessionKeyExpirationDate { get; set; } = DateTime.UtcNow.AddHours(48);

        // Relacja: Jedno wesele ma wiele zdjęć
        public ICollection<ImageData>? ImageDatas { get; set; }

        // Relacja: Jedno wesele ma wielu administratorów
        public ICollection<WeddingUser>? WeddingUser { get; set; }



        //--------------------------------------------------------------------------------------
        // Właściwość obliczeniowa do sprawdzania, czy klucz wygasł
        public bool IsSessionKeyExpired => DateTime.Now.ToUniversalTime() >= SessionKeyExpirationDate;

    }
}
