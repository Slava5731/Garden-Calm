/**
 * Система логирования для Garden Calm
 * 
 * Предоставляет унифицированный интерфейс для логирования событий
 * и мониторинга работы приложения.
 */

/**
 * Уровни логирования
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Интерфейс для метрики
 */
export interface Metric {
  /**
   * Название метрики
   */
  name: string;
  
  /**
   * Значение метрики
   */
  value: number;
  
  /**
   * Дополнительные теги/метки
   */
  tags?: Record<string, string>;
  
  /**
   * Временная метка
   */
  timestamp?: Date;
}

/**
 * Класс для логирования и мониторинга
 */
export class Logger {
  private static instance: Logger;
  private logEnabled: boolean = true;
  private metricsEnabled: boolean = true;
  private metricsBuffer: Metric[] = [];
  
  /**
   * Получить экземпляр логгера (Singleton)
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  /**
   * Приватный конструктор для Singleton
   */
  private constructor() {
    // В реальном приложении здесь была бы инициализация
    // внешних систем логирования и мониторинга
    console.log('[Logger] Initialized');
    
    // Периодическая отправка метрик
    setInterval(() => this.flushMetrics(), 60000);
  }
  
  /**
   * Логирование сообщения
   * 
   * @param level Уровень логирования
   * @param message Сообщение для логирования
   * @param context Дополнительный контекст
   */
  public log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.logEnabled) return;
    
    const timestamp = new Date().toISOString();
    const formattedContext = context ? JSON.stringify(context) : '';
    
    // В реальном приложении здесь был бы код для отправки логов
    // в централизованную систему логирования (например, ELK)
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message} ${formattedContext}`);
  }
  
  /**
   * Логирование отладочного сообщения
   * 
   * @param message Сообщение для логирования
   * @param context Дополнительный контекст
   */
  public debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }
  
  /**
   * Логирование информационного сообщения
   * 
   * @param message Сообщение для логирования
   * @param context Дополнительный контекст
   */
  public info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }
  
  /**
   * Логирование предупреждения
   * 
   * @param message Сообщение для логирования
   * @param context Дополнительный контекст
   */
  public warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }
  
  /**
   * Логирование ошибки
   * 
   * @param message Сообщение для логирования
   * @param error Объект ошибки
   * @param context Дополнительный контекст
   */
  public error(message: string, error?: Error, context?: Record<string, any>): void {
    const errorContext = error ? {
      ...context,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    } : context;
    
    this.log(LogLevel.ERROR, message, errorContext);
  }
  
  /**
   * Отправка метрики
   * 
   * @param metric Метрика для отправки
   */
  public trackMetric(metric: Metric): void {
    if (!this.metricsEnabled) return;
    
    const enrichedMetric = {
      ...metric,
      timestamp: metric.timestamp || new Date()
    };
    
    // Добавляем метрику в буфер
    this.metricsBuffer.push(enrichedMetric);
    
    // В реальном приложении здесь был бы код для отправки метрик
    // в систему мониторинга (например, Prometheus)
    console.log(`[Metric] ${metric.name}: ${metric.value}`);
  }
  
  /**
   * Отправка накопленных метрик
   */
  private flushMetrics(): void {
    if (this.metricsBuffer.length === 0) return;
    
    // В реальном приложении здесь был бы код для пакетной отправки метрик
    console.log(`[Metrics] Flushing ${this.metricsBuffer.length} metrics`);
    
    // Очищаем буфер
    this.metricsBuffer = [];
  }
  
  /**
   * Включение/выключение логирования
   */
  public setLoggingEnabled(enabled: boolean): void {
    this.logEnabled = enabled;
  }
  
  /**
   * Включение/выключение сбора метрик
   */
  public setMetricsEnabled(enabled: boolean): void {
    this.metricsEnabled = enabled;
  }
}

/**
 * Экспортируем экземпляр логгера для использования в приложении
 */
export const logger = Logger.getInstance();
