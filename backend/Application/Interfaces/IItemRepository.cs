using System.Collections.Generic;
using System.Threading.Tasks;
using SalesDesk.Domain.Entities;

namespace SalesDesk.Application.Interfaces
{
    public interface IItemRepository
    {
        Task<IEnumerable<Item>> GetAllAsync();
        Task<Item> GetByIdAsync(int id);
    }
}
