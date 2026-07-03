using AutoMapper;
using SalesDesk.API.Models;
using SalesDesk.Domain.Entities;

namespace SalesDesk.Application
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Client, ClientDto>().ReverseMap();
            CreateMap<Item, ItemDto>().ReverseMap();
            
            CreateMap<SalesOrder, SalesOrderDto>()
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Client != null ? src.Client.CustomerName : null))
                .ForMember(dest => dest.Lines, opt => opt.MapFrom(src => src.SalesOrderLines));
                
            CreateMap<SalesOrderDto, SalesOrder>()
                .ForMember(dest => dest.SalesOrderLines, opt => opt.MapFrom(src => src.Lines));

            CreateMap<SalesOrderLine, SalesOrderLineDto>()
                .ForMember(dest => dest.ItemCode, opt => opt.MapFrom(src => src.Item != null ? src.Item.ItemCode : null))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Item != null ? src.Item.Description : null));
                
            CreateMap<SalesOrderLineDto, SalesOrderLine>();
        }
    }
}
