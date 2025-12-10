import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MessageSquare, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { base44 } from '@/api/base44Client';
import { cn } from "@/lib/utils";

export default function ContactTemplates({ buyer, property, matchScore }) {
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customTemplates, setCustomTemplates] = useState(null);

  const defaultTemplates = {
    sms: `Hi ${buyer.full_name?.split(' ')[0] || 'there'}, I have a ${property.lot_size_acres} acre lot in ${property.county} County at $${property.asking_price?.toLocaleString()}. Based on your recent activity, thought this might fit your buy box. Interested in details?`,
    
    email: `Subject: ${property.lot_size_acres} Acre Lot in ${property.county} County - $${property.asking_price?.toLocaleString()}

Hi ${buyer.full_name?.split(' ')[0] || 'there'},

I came across your recent land acquisitions in Florida and wanted to reach out about a property that matches your buying criteria.

Property Details:
• Location: ${property.address}
• County: ${property.county}
• Size: ${property.lot_size_acres} acres
• Asking Price: $${property.asking_price?.toLocaleString()}
• Zoning: ${property.zoning || 'Residential'}
• Flood Zone: ${property.flood_zone || 'To be verified'}
• Utilities: ${property.utilities || 'Available'}

Given your focus on ${property.county} County and similar properties, I believe this could be a strong fit for ${buyer.company_name}.

Would you like to schedule a quick call to discuss?

Best regards`,
    
    callScript: `OPENING:
"Hi, is this ${buyer.full_name}? This is [Your Name]. I'm reaching out because I noticed ${buyer.company_name} has been actively acquiring residential lots in ${property.county} County."

PROPERTY PITCH:
"I have a ${property.lot_size_acres} acre lot at ${property.address}. It's listed at $${property.asking_price?.toLocaleString()}, ${property.zoning || 'residential'} zoning, ${property.flood_zone || 'good flood zone'}."

QUALIFYING QUESTIONS:
• "Is this size and location something you're currently looking at?"
• "What's your typical timeline for closing on a property like this?"
• "Do you have any specific requirements I should know about?"

CLOSE:
"Would you like me to send over the property details and we can set up a time to discuss further?"`
  };

  const generateAITemplates = async () => {
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate highly personalized outreach templates for a land deal:

BUYER:
- Name: ${buyer.full_name}
- Company: ${buyer.company_name}
- Type: ${buyer.buyer_type}
- Recent deals: ${buyer.total_lots_acquired_6mo} in last 6 months
- Target counties: ${buyer.target_counties?.join(', ')}
- Price range: $${buyer.price_range_min?.toLocaleString()}-$${buyer.price_range_max?.toLocaleString()}

PROPERTY:
- Address: ${property.address}
- County: ${property.county}
- Price: $${property.asking_price?.toLocaleString()}
- Size: ${property.lot_size_acres} acres
- Zoning: ${property.zoning}
- Match Score: ${matchScore}%

Create compelling, professional templates that reference the buyer's specific activity and how this property fits their criteria.`,
        response_json_schema: {
          type: "object",
          properties: {
            sms: { type: "string" },
            email: { type: "string" },
            callScript: { type: "string" }
          }
        }
      });
      setCustomTemplates(result);
      toast.success('AI templates generated!');
    } catch (error) {
      toast.error('Failed to generate templates');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const templates = customTemplates || defaultTemplates;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Contact Templates</h3>
        <Button
          onClick={generateAITemplates}
          disabled={loading}
          size="sm"
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          AI Generate
        </Button>
      </div>

      <Tabs defaultValue="sms" className="p-4">
        <TabsList className="bg-slate-700/50 mb-4">
          <TabsTrigger value="sms" className="data-[state=active]:bg-slate-600">
            <MessageSquare className="w-4 h-4 mr-2" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-slate-600">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="call" className="data-[state=active]:bg-slate-600">
            <Phone className="w-4 h-4 mr-2" />
            Call Script
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sms" className="space-y-3">
          <Textarea
            value={templates.sms}
            readOnly
            className="bg-slate-700/50 border-slate-600 text-slate-200 min-h-[120px]"
          />
          <Button
            onClick={() => copyToClipboard(templates.sms, 'sms')}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            {copied === 'sms' ? (
              <><Check className="w-4 h-4 mr-2 text-emerald-400" /> Copied!</>
            ) : (
              <><Copy className="w-4 h-4 mr-2" /> Copy SMS</>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="email" className="space-y-3">
          <Textarea
            value={templates.email}
            readOnly
            className="bg-slate-700/50 border-slate-600 text-slate-200 min-h-[300px]"
          />
          <Button
            onClick={() => copyToClipboard(templates.email, 'email')}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            {copied === 'email' ? (
              <><Check className="w-4 h-4 mr-2 text-emerald-400" /> Copied!</>
            ) : (
              <><Copy className="w-4 h-4 mr-2" /> Copy Email</>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="call" className="space-y-3">
          <Textarea
            value={templates.callScript}
            readOnly
            className="bg-slate-700/50 border-slate-600 text-slate-200 min-h-[300px] font-mono text-sm"
          />
          <Button
            onClick={() => copyToClipboard(templates.callScript, 'call')}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            {copied === 'call' ? (
              <><Check className="w-4 h-4 mr-2 text-emerald-400" /> Copied!</>
            ) : (
              <><Copy className="w-4 h-4 mr-2" /> Copy Script</>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}