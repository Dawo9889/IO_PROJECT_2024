using AutoMapper;
using Backend.Application.DTO.ImageDTO;
using Backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.Mappings
{
    public class ImageMappingProfile :Profile
    {
        public ImageMappingProfile()
        {
            CreateMap<CreateImageDTO, ImageData>()
             .ForMember(dest => dest.FilePath, opt => opt.Ignore()) //reczne przypisanie
             .ForMember(dest => dest.WeddingId, opt => opt.MapFrom(src => src.WeddingID));

            CreateMap<ImageData, ImagesDataDTO>();
        }
    }
}
