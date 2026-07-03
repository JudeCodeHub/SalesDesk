using System.Collections.Generic;
using System.Threading.Tasks;
using SalesDesk.API.Models;

namespace SalesDesk.Application.Interfaces
{
    public interface IItemService
    {
        Task<IEnumerable<ItemDto>> GetAllItemsAsync();
    }
}
