
# Hooks de Gamificação - Documentação

## Visão Geral

Este documento descreve a arquitetura dos hooks de gamificação após o refactoring, separando responsabilidades e melhorando a manutenibilidade.

## Estrutura dos Hooks

### 1. `useGamification.ts` - Interface Principal
**Responsabilidade**: Notificações, sons e efeitos visuais + Lógica de cálculo

**Funções principais**:
- `showLevelUpNotification()` - Notificação de level up
- `showCycleCompletedNotification()` - Notificação de ciclo completado
- `showMedalNotification()` - Notificação de medalhas
- `showStreakIncreasedNotification()` - Notificação de streak aumentada
- `showStreakLostNotification()` - Notificação de streak perdida
- `showStreakProtectedNotification()` - Notificação de streak protegida
- `toggleSound()` - Liga/desliga som
- `isSoundEnabled()` - Verifica se som está habilitado
- `playMedalSound()` - Toca som de medalha
- `playXPSound()` - Toca som de XP
- `showFloatingXP()` - Mostra XP flutuante
- `calculateProgressFromSession()` - Calcula progresso de sessão
- `calculateCycleCompletionBonus()` - Calcula bônus de ciclo
- `resetCycleStreak()` - Reseta streak de ciclo
- `initializeProgress()` - Inicializa progresso

### 2. `useGamificationLogic.ts` - Lógica Pura
**Responsabilidade**: Apenas cálculos de gamificação sem efeitos colaterais

**Funções principais**:
- `calculateProgressFromSession()` - Calcula progresso de sessão
- `calculateCycleCompletionBonus()` - Calcula bônus de ciclo
- `consumeProtectionShield()` - Consome escudo de proteção
- `resetCycleStreak()` - Reseta streak de ciclo
- `initializeProgress()` - Inicializa progresso

### 3. `useLoginStreakLogic.ts` - Lógica de Login Streak
**Responsabilidade**: Lógica específica para streaks de login

**Funções principais**:
- `calculateLoginBonuses()` - Calcula bônus de login
- `processNormalLogin()` - Processa login normal
- `processSimulatedLogin()` - Processa login simulado

### 4. `useLoginStreak.ts` - Interface de Login Streak
**Responsabilidade**: Interface completa para login streaks incluindo efeitos

**Funções principais**:
- `calculateLoginBonuses()` - Calcula bônus de login
- `checkDailyLogin()` - Verifica login diário
- `refreshCounter` - Contador de refresh
- `lastKnownSimulatedStreak` - Último streak simulado conhecido

## Padrões de Uso

### Para Notificações e Efeitos Visuais
```typescript
const { showLevelUpNotification, playMedalSound } = useGamification();
```

### Para Cálculos Puros
```typescript
const { calculateProgressFromSession } = useGamificationLogic();
```

### Para Login Streaks
```typescript
const { checkDailyLogin } = useLoginStreak(userProgress, setUserProgress);
```

## Princípios de Design

1. **Separação de Responsabilidades**: Cada hook tem uma responsabilidade específica
2. **Reutilização**: Hooks podem ser usados independentemente
3. **Testabilidade**: Lógica pura separada de efeitos colaterais
4. **Performance**: Uso de `useCallback` e `useMemo` para otimização
5. **Consistência**: Padrões consistentes em todos os hooks

## Migração

Se você estava usando hooks antigos, migre para:
- `useGamification()` para notificações e sons
- `useGamificationLogic()` para cálculos puros
- `useLoginStreak()` para login streaks
