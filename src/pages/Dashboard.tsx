import { ArrowUpRight, Users, Eye, Target, MousePointerClick } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', leads: 4000, traffic: 2400 },
  { name: 'Tue', leads: 3000, traffic: 1398 },
  { name: 'Wed', leads: 2000, traffic: 9800 },
  { name: 'Thu', leads: 2780, traffic: 3908 },
  { name: 'Fri', leads: 1890, traffic: 4800 },
  { name: 'Sat', leads: 2390, traffic: 3800 },
  { name: 'Sun', leads: 3490, traffic: 4300 },
];

const stats = [
  { name: 'Total Leads', stat: '71,897', icon: Users, change: '12%', changeType: 'increase' },
  { name: 'Avg. Traffic', stat: '58.16%', icon: Eye, change: '2.02%', changeType: 'increase' },
  { name: 'Avg. CPC', stat: '$1.24', icon: MousePointerClick, change: '4.05%', changeType: 'decrease' },
  { name: 'Conversions', stat: '24.57%', icon: Target, change: '5.4%', changeType: 'increase' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="glass-card rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <item.icon className="w-24 h-24" />
            </div>
            <dt>
              <div className="absolute bg-primary/10 p-3 rounded-md">
                <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-muted-foreground truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 pb-2 flex items-baseline sm:pb-3">
              <p className="text-2xl font-semibold text-foreground">{item.stat}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {item.changeType === 'increase' ? (
                  <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                ) : (
                  <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4 text-red-500 transform rotate-90" aria-hidden="true" />
                )}
                <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6 h-96">
        <h3 className="text-lg font-medium leading-6 text-foreground mb-4">Traffic vs Leads Over Time</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)', color: '#0f172a' }} />
            <Area type="monotone" dataKey="traffic" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTraffic)" />
            <Area type="monotone" dataKey="leads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLeads)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Active Campaigns Table Placeholder */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-medium leading-6 text-foreground mb-4">Active Meta Campaigns</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black/10">
            <thead>
              <tr>
                <th scope="col" className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Campaign Name</th>
                <th scope="col" className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th scope="col" className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Spend</th>
                <th scope="col" className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="py-4 whitespace-nowrap text-sm font-medium text-foreground">Spring Collection Retargeting {i}</td>
                  <td className="py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100/10 text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="py-4 whitespace-nowrap text-sm text-muted-foreground">$1,234.56</td>
                  <td className="py-4 whitespace-nowrap text-sm text-muted-foreground">4.2x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
