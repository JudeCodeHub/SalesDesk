using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalesDesk.Application.Interfaces;
using SalesDesk.Domain.Entities;
using SalesDesk.Infrastructure.Data;

namespace SalesDesk.Infrastructure.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly SalesDeskDbContext _context;

        public ClientRepository(SalesDeskDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Client>> GetAllAsync()
        {
            return await _context.Clients.ToListAsync();
        }

        public async Task<Client> GetByIdAsync(int id)
        {
            return await _context.Clients.FindAsync(id);
        }
    }
}
