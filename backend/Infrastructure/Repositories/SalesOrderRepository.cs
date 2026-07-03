using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalesDesk.Application.Interfaces;
using SalesDesk.Domain.Entities;
using SalesDesk.Infrastructure.Data;

namespace SalesDesk.Infrastructure.Repositories
{
    public class SalesOrderRepository : ISalesOrderRepository
    {
        private readonly SalesDeskDbContext _context;

        public SalesOrderRepository(SalesDeskDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SalesOrder>> GetAllAsync()
        {
            return await _context.SalesOrders
                .Include(so => so.Client)
                .Include(so => so.SalesOrderLines)
                    .ThenInclude(sol => sol.Item)
                .ToListAsync();
        }

        public async Task<SalesOrder> GetByIdAsync(int id)
        {
            return await _context.SalesOrders
                .Include(so => so.Client)
                .Include(so => so.SalesOrderLines)
                    .ThenInclude(sol => sol.Item)
                .FirstOrDefaultAsync(so => so.OrderId == id);
        }

        public async Task AddAsync(SalesOrder order)
        {
            await _context.SalesOrders.AddAsync(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SalesOrder order)
        {
            _context.SalesOrders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var order = await GetByIdAsync(id);
            if (order != null)
            {
                _context.SalesOrders.Remove(order);
                await _context.SaveChangesAsync();
            }
        }
    }
}
