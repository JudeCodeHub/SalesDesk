using System.Collections.Generic;
using System.Threading.Tasks;
using SalesDesk.API.Models;

namespace SalesDesk.Application.Interfaces
{
    public interface ISalesOrderService
    {
        Task<IEnumerable<SalesOrderDto>> GetAllOrdersAsync();
        Task<SalesOrderDto> GetOrderByIdAsync(int id);
        Task CreateOrderAsync(SalesOrderDto dto);
        Task UpdateOrderAsync(int id, SalesOrderDto dto);
        Task DeleteOrderAsync(int id);
    }
}
