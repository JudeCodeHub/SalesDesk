using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using SalesDesk.Application.Interfaces;
using SalesDesk.API.Models;
using SalesDesk.Domain.Entities;

namespace SalesDesk.Application.Services
{
    public class SalesOrderService : ISalesOrderService
    {
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly IMapper _mapper;

        public SalesOrderService(ISalesOrderRepository salesOrderRepository, IMapper mapper)
        {
            _salesOrderRepository = salesOrderRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SalesOrderDto>> GetAllOrdersAsync()
        {
            var orders = await _salesOrderRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SalesOrderDto>>(orders);
        }

        public async Task<SalesOrderDto> GetOrderByIdAsync(int id)
        {
            var order = await _salesOrderRepository.GetByIdAsync(id);
            return _mapper.Map<SalesOrderDto>(order);
        }

        public async Task CreateOrderAsync(SalesOrderDto dto)
        {
            if (await _salesOrderRepository.InvoiceNoExistsAsync(dto.InvoiceNo))
            {
                throw new ArgumentException("Invoice number already exists");
            }

            var order = _mapper.Map<SalesOrder>(dto);
            CalculateOrderTotals(order);
            order.CreatedDate = DateTime.UtcNow;
            
            await _salesOrderRepository.AddAsync(order);
        }

        public async Task UpdateOrderAsync(int id, SalesOrderDto dto)
        {
            if (await _salesOrderRepository.InvoiceNoExistsAsync(dto.InvoiceNo, id))
            {
                throw new ArgumentException("Invoice number already exists");
            }

            var existingOrder = await _salesOrderRepository.GetByIdAsync(id);
            if (existingOrder == null)
            {
                throw new Exception("Order not found");
            }

            _mapper.Map(dto, existingOrder);
            
            CalculateOrderTotals(existingOrder);

            await _salesOrderRepository.UpdateAsync(existingOrder);
        }

        private void CalculateOrderTotals(SalesOrder order)
        {
            decimal totalExcl = 0;
            decimal totalTax = 0;
            decimal totalIncl = 0;

            if (order.SalesOrderLines != null)
            {
                foreach (var line in order.SalesOrderLines)
                {
                    line.ExclAmount = line.Quantity * line.Price;
                    line.TaxAmount = line.ExclAmount * line.TaxRate / 100m;
                    line.InclAmount = line.ExclAmount + line.TaxAmount;

                    totalExcl += line.ExclAmount;
                    totalTax += line.TaxAmount;
                    totalIncl += line.InclAmount;
                }
            }

            order.TotalExcl = totalExcl;
            order.TotalTax = totalTax;
            order.TotalIncl = totalIncl;
        }

        public async Task DeleteOrderAsync(int id)
        {
            await _salesOrderRepository.DeleteAsync(id);
        }
    }
}
