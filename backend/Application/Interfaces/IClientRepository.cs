using System.Collections.Generic;
using System.Threading.Tasks;
using SalesDesk.Domain.Entities;

namespace SalesDesk.Application.Interfaces
{
    public interface IClientRepository
    {
        Task<IEnumerable<Client>> GetAllAsync();
        Task<Client> GetByIdAsync(int id);
    }
}
