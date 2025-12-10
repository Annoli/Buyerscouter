import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, File, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function ExportTools({ buyers, matchResults, propertyInfo }) {
  const [exporting, setExporting] = useState(false);

  const exportToCSV = () => {
    setExporting(true);
    try {
      const headers = [
        'Company Name', 'Contact Name', 'Buyer Type', 'Phone', 'Email',
        'Target Counties', 'Price Range Min', 'Price Range Max',
        'Lot Size Min', 'Lot Size Max', 'Match Score', 'Flood Zone Tolerance',
        'Utilities Preference', 'Last Purchase Date', 'Deals (6mo)'
      ];

      const rows = buyers.map(buyer => {
        const match = matchResults?.find(m => m.buyerId === buyer.id);
        return [
          buyer.company_name,
          buyer.full_name,
          buyer.buyer_type,
          buyer.phone,
          buyer.email,
          (buyer.target_counties || []).join('; '),
          buyer.price_range_min,
          buyer.price_range_max,
          buyer.lot_size_min_acres,
          buyer.lot_size_max_acres,
          match?.score || 'N/A',
          buyer.flood_zone_tolerance,
          buyer.utilities_preference,
          buyer.last_purchase_date,
          buyer.total_lots_acquired_6mo
        ];
      });

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell || ''}"`).join(','))
        .join('\n');

      downloadFile(csvContent, 'florida-buyers-export.csv', 'text/csv');
    } finally {
      setExporting(false);
    }
  };

  const exportToJSON = () => {
    setExporting(true);
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        property: propertyInfo,
        buyers: buyers.map(buyer => {
          const match = matchResults?.find(m => m.buyerId === buyer.id);
          return {
            ...buyer,
            matchScore: match?.score || null,
            matchBreakdown: match?.breakdown || null
          };
        })
      };

      downloadFile(JSON.stringify(exportData, null, 2), 'florida-buyers-export.json', 'application/json');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async () => {
    setExporting(true);
    try {
      // Generate HTML for PDF
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1a1a2e; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
            h2 { color: #333; margin-top: 30px; }
            .property-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #1a1a2e; color: white; padding: 12px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background: #f9f9f9; }
            .score-high { color: #10b981; font-weight: bold; }
            .score-med { color: #f59e0b; font-weight: bold; }
            .score-low { color: #ef4444; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Florida Land Buyer Match Report</h1>
          ${propertyInfo ? `
            <div class="property-info">
              <h3>Property: ${propertyInfo.address}</h3>
              <p>County: ${propertyInfo.county} | Price: $${propertyInfo.asking_price?.toLocaleString()} | Size: ${propertyInfo.lot_size_acres} acres</p>
            </div>
          ` : ''}
          <h2>Buyer Matches (${buyers.length} total)</h2>
          <table>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Counties</th>
              <th>Price Range</th>
              <th>Match</th>
            </tr>
            ${buyers.map(buyer => {
              const match = matchResults?.find(m => m.buyerId === buyer.id);
              const score = match?.score;
              const scoreClass = score >= 80 ? 'score-high' : score >= 50 ? 'score-med' : 'score-low';
              return `
                <tr>
                  <td>${buyer.company_name}</td>
                  <td>${buyer.full_name}</td>
                  <td>${buyer.phone || '-'}</td>
                  <td>${buyer.email || '-'}</td>
                  <td>${(buyer.target_counties || []).slice(0, 3).join(', ')}</td>
                  <td>$${buyer.price_range_min?.toLocaleString()}-$${buyer.price_range_max?.toLocaleString()}</td>
                  <td class="${scoreClass}">${score ? score + '%' : 'N/A'}</td>
                </tr>
              `;
            }).join('')}
          </table>
          <p style="margin-top: 30px; color: #666; font-size: 12px;">Generated by Florida Land Buyer Platform • ${new Date().toLocaleDateString()}</p>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'florida-buyers-report.html';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className="bg-[#2D2F36] hover:bg-[#3A3D44] text-white border-0"
          disabled={exporting}
        >
          {exporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-700">
        <DropdownMenuItem 
          onClick={exportToCSV}
          className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-400" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportToJSON}
          className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          <File className="w-4 h-4 mr-2 text-blue-400" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportToPDF}
          className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          <FileText className="w-4 h-4 mr-2 text-red-400" />
          Export as Report (HTML)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}