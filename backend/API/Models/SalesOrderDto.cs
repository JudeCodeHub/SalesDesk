using System;
using System.Collections.Generic;

namespace SalesDesk.API.Models
{
    public class SalesOrderDto
    {
        public int OrderId { get; set; }
        public int ClientId { get; set; }
        public string CustomerName { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string ReferenceNo { get; set; }
        public string Note { get; set; }
        public decimal TotalExcl { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalIncl { get; set; }
        public List<SalesOrderLineDto> Lines { get; set; } = new List<SalesOrderLineDto>();
    }
}
