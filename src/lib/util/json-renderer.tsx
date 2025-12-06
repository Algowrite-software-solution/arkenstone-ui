interface JsonRendererProps {
  data: any;
  heading?: string;
  keyLabels?: Record<string, string>;
}

// Helper to make keys readable (e.g., "fatContent" -> "Fat Content")
const formatFallbackKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Helper to safely render any item (String, Object, or Array)
const renderItem = (item: any): React.ReactNode => {
  if (item === null || item === undefined) return null;

  // 1. If it's a simple string/number, render it
  if (typeof item !== 'object') {
    return <span className="text-gray-700">{String(item)}</span>;
  }

  // 2. If it's an object, try to find a displayable text field
  // Prioritize common keys found in API data
  if (item.name) return <span className="text-gray-700">{item.name}</span>;
  if (item.label) return <span className="text-gray-700">{item.label}</span>;
  if (item.value) return <span className="text-gray-700">{item.value}</span>;
  if (item.description) return <span className="text-gray-700">{item.description}</span>;
  
  // Specific handling for your "packaging" type objects
  if (item.type) {
    return (
      <span className="text-gray-700">
        {item.type} {item.weight && <span className="text-gray-500">({item.weight})</span>}
      </span>
    );
  }

  // 3. Fallback: If no known text field, stringify it to avoid crash
  return <span className="text-xs font-mono text-gray-500">{JSON.stringify(item)}</span>;
};

export function JsonRenderer({ data, heading, keyLabels = {} }: JsonRendererProps) {
  
  // Logic to render the content of a row
  const extractContent = (val: any): React.ReactNode => {
    if (!val) return <span className="text-gray-400">-</span>;

    // Handle Arrays (render a list)
    if (Array.isArray(val)) {
      return (
        <ul className="list-none space-y-1">
          {val.map((item, idx) => (
            <li key={idx} className="flex items-start">
              {/* Only show bullet point if it's a simple string */}
              {renderItem(item)}
            </li>
          ))}
        </ul>
      );
    }

    // Handle Objects (render single item)
    if (typeof val === 'object') {
       // Special case for "options" arrays inside objects (like particleSize)
       if (val.options && Array.isArray(val.options)) {
         return <span className="text-gray-600">{val.options.join(", ")}</span>;
       }
       return renderItem(val);
    }

    // Handle Primitives
    return <span className="text-gray-600">{String(val)}</span>;
  };

  // 1. Handle if the root `data` passed is an Array
  if (Array.isArray(data)) {
    return (
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {heading && (
          <h2 className="absolute -top-3 left-4 bg-white px-2 text-xl font-semibold text-gray-900">
            {heading}
          </h2>
        )}
         <ul className="space-y-3">
            {data.map((item, i) => (
                <li key={i} className="flex items-start">
                    {/* <span className="mr-2 text-gray-400">•</span>  */}
                    {renderItem(item)}
                </li>
            ))}
         </ul>
      </div>
    );
  }

  // 2. Handle if the root `data` is an Object
  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {heading && (
        <h2 className="absolute -top-3 left-4 bg-white px-2 text-xl font-semibold text-gray-900">
          {heading}
        </h2>
      )}
      {Object.entries(data).map(([key, value]) => {
        const displayTitle = keyLabels[key] || formatFallbackKey(key);
        return (
          <div key={key} className="flex flex-col md:flex-row py-4 last:border-0">
            <div className="w-full md:w-1/3 pr-4 mb-2 md:mb-0">
              <span className="font-medium text-gray-900">{displayTitle}</span>
            </div>
            <div className="w-full md:w-2/3">
              {extractContent(value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}