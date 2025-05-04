# Tipos y Interfaces

## 📝 Modelos de Datos

### Script
```typescript
interface Script {
  id: string;
  title: string;
  lines: ScriptLine[];
}

interface ScriptLine {
  text: string;
  type: 'empathy' | 'solution' | 'benefit' | 'closing';
}
```

### Rate
```typescript
interface Rate {
  id: string;
  planName: string;
  price: number;
  features: string[];
  isPromotional: boolean;
}
``` 