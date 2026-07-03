using System.Collections.Generic;
using System.Threading.Tasks;
using SalesDesk.Domain.Entities;

namespace SalesDesk.Application.Interfaces
{
    public interface ISalesOrderRepository
    {
        Task<IEnumerable<SalesOrder>> GetAllAsync();
        Task<SalesOrder> GetByIdAsync(int id);
        Task<bool> InvoiceNoExistsAsync(string invoiceNo, int? excludeOrderId = null);
        Task AddAsync(SalesOrder order);
        Task UpdateAsync(SalesOrder order);
        Task DeleteAsync(int id);
    }
}
