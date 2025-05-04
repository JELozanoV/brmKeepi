# Servicios de la Aplicación

## 🌐 API Services

### ScriptService
```typescript
interface ScriptService {
  getScriptByType(type: SolutionType): Promise<Script>;
  getAllScripts(): Promise<Script[]>;
}
```

### RatesService
```typescript
interface RatesService {
  getRatesByPlan(planType: PlanType): Promise<Rate[]>;
  getCurrentPromotions(): Promise<Promotion[]>;
}
```

## 🔐 Autenticación
Por implementar - Integración con sistema de autenticación de Claro 