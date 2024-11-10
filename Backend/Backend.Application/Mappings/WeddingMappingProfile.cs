using AutoMapper;
using Backend.Application.DTO.WeddingDTO;
using Backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.Mappings
{
    public class WeddingMappingProfile : Profile
    {
        public WeddingMappingProfile()
        {
            CreateMap<WeddingDTO, Wedding>();
            CreateMap<Wedding, WeddingDTO>();

            CreateMap<Wedding, WeddingDetailsDTO>()
            .ForMember(dest => dest.ImagesCount, opt => opt.MapFrom(src => src.ImageDatas != null ? src.ImageDatas.Count : 0));
        }
    }
}
