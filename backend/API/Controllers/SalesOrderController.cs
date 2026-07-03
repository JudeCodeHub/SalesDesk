using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SalesDesk.Application.Interfaces;
using SalesDesk.API.Models;

namespace SalesDesk.API.Controllers
{
    [ApiController]
    [Route("api/salesorders")]
    public class SalesOrderController : ControllerBase
    {
        private readonly ISalesOrderService _salesOrderService;

        public SalesOrderController(ISalesOrderService salesOrderService)
        {
            _salesOrderService = salesOrderService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesOrderDto>>> GetAll()
        {
            var orders = await _salesOrderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SalesOrderDto>> GetById(int id)
        {
            var order = await _salesOrderService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] SalesOrderDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            try
            {
                await _salesOrderService.CreateOrderAsync(dto);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] SalesOrderDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _salesOrderService.UpdateOrderAsync(id, dto);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                if (ex.Message == "Order not found")
                {
                    return NotFound();
                }
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _salesOrderService.DeleteOrderAsync(id);
            return Ok();
        }
    }
}
