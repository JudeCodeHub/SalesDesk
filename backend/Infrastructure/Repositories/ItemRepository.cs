using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalesDesk.Application.Interfaces;
using SalesDesk.Domain.Entities;
using SalesDesk.Infrastructure.Data;

namespace SalesDesk.Infrastructure.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly SalesDeskDbContext _context;

        public ItemRepository(SalesDeskDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Item>> GetAllAsync()
        {
            return await _context.Items.ToListAsync();
        }

        public async Task<Item> GetByIdAsync(int id)
        {
            return await _context.Items.FindAsync(id);
        }
    }
}
