import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SimpleChartProps {
  title: string;
  description?: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  type: 'bar' | 'pie' | 'line';
}

export const SimpleChart = ({ title, description, data, type }: SimpleChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value));

  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-24 text-sm text-gray-600 truncate" title={item.label}>
            {item.label}
          </div>
          <div className="flex-1 relative">
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  item.color || 'bg-blue-500'
                } rounded-full`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
          <div className="w-12 text-sm font-medium text-gray-900 text-right">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return (
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full ${item.color || 'bg-blue-500'}`}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <div className="text-sm font-medium">
              {item.value} ({((item.value / total) * 100).toFixed(1)}%)
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLineChart = () => (
    <div className="relative h-40 bg-gray-50 rounded-lg p-4">
      <div className="flex items-end h-32 space-x-1">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="relative flex flex-col items-center">
              {/* Valor en la parte superior */}
              <div className="text-xs font-medium text-gray-700 mb-1">
                {item.value}
              </div>
              {/* Barra del gráfico */}
              <div 
                className={`w-4 ${item.color || 'bg-blue-500'} rounded-t transition-all duration-500 min-h-2`}
                style={{ height: `${Math.max(8, (item.value / maxValue) * 120)}px` }}
              />
            </div>
            {/* Etiqueta del mes en la parte inferior */}
            <div className="text-xs text-gray-500 text-center mt-2 font-medium">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {type === 'bar' && renderBarChart()}
        {type === 'pie' && renderPieChart()}
        {type === 'line' && renderLineChart()}
      </CardContent>
    </Card>
  );
};