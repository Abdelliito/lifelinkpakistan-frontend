# LifeLink Pakistan - Monitoring & Observability Guide

## Overview

This guide describes monitoring, logging, and observability best practices for LifeLink Pakistan.

## Logging

### Backend Logging Configuration

Structured JSON logging in production:

```python
# app/core/logging.py - already configured
# Logs are output to stdout in JSON format

# Log levels
DEBUG   - Detailed diagnostic information
INFO    - General informational messages
WARNING - Warning messages for potentially harmful situations
ERROR   - Error messages for serious problems
CRITICAL- Critical errors that may halt application
```

### Log Aggregation

Recommended services:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **CloudWatch** (AWS)
- **Stackdriver** (Google Cloud)
- **Datadog**
- **Splunk**

### Example Log Configuration for ELK

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "ERROR",
  "logger": "app.services.ai_service",
  "message": "Failed to parse AI response",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user123",
  "exception": "Invalid JSON response",
  "stack_trace": "..."
}
```

## Metrics & Monitoring

### Key Metrics to Track

#### API Performance
- Response time (p50, p95, p99)
- Request rate (requests/second)
- Error rate (errors/total requests)
- Throughput (MB/s)

#### Database
- Query execution time
- Connection pool usage
- Slow queries (> 1 second)
- Database errors
- Replication lag (if applicable)

#### System Resources
- CPU usage
- Memory usage
- Disk usage
- Network I/O

#### Application
- Active users
- Authentication failures
- Request validation errors
- Rate limit hits
- Cache hit/miss ratio

### Prometheus Metrics

```python
# Backend metrics
from prometheus_client import Counter, Histogram, Gauge

# API requests
request_count = Counter(
    'lifelink_api_requests_total',
    'Total API requests',
    ['method', 'endpoint', 'status']
)

request_duration = Histogram(
    'lifelink_api_request_duration_seconds',
    'API request duration',
    ['method', 'endpoint']
)

# Database
db_connection_pool = Gauge(
    'lifelink_db_pool_connections',
    'Database connection pool size',
    ['status']  # available, in_use
)
```

### Monitoring Stack Example

```yaml
# docker-compose-monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

volumes:
  prometheus_data:
  grafana_data:
```

## Health Checks

### Backend Health Check

```bash
GET /health
Response:
{
  "status": "healthy",
  "environment": "production"
}
```

### Frontend Health Check

```bash
GET /
# Returns 200 if application is running
```

### Database Health Check

```bash
# Kubernetes-style check
SELECT 1;  # Simple connectivity test
SELECT COUNT(*) FROM pg_stat_activity;  # Detailed check
```

### Liveness vs Readiness

```python
@app.get("/live")
def liveness():
    """Indicates if service is running (for Kubernetes)."""
    return {"status": "alive"}

@app.get("/ready")
def readiness():
    """Indicates if service is ready to handle requests."""
    db = SessionLocal()
    try:
        db.execute("SELECT 1")
        return {"status": "ready", "dependencies": {"database": "ok"}}
    except Exception as e:
        return {"status": "not_ready", "reason": str(e)}, 503
    finally:
        db.close()
```

## Alerting

### Alert Rules (Prometheus)

```yaml
groups:
  - name: lifelink
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: rate(lifelink_api_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"

      # High response time
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, lifelink_api_request_duration_seconds) > 1
        for: 5m
        annotations:
          summary: "95th percentile response time > 1s"

      # Database connection pool exhaustion
      - alert: DatabaseConnectionPoolExhausted
        expr: lifelink_db_pool_connections{status="available"} == 0
        for: 1m
        annotations:
          summary: "Database connection pool exhausted"

      # Service down
      - alert: ServiceDown
        expr: up{job="lifelink-api"} == 0
        for: 1m
        annotations:
          summary: "LifeLink API is down"
```

### Alert Notification Channels

- Email
- Slack
- PagerDuty
- SMS
- Webhooks

### Alert Severity Levels

```
CRITICAL - Service down or major feature broken
MAJOR    - Significant performance degradation
MINOR    - Minor issues or warnings
INFO     - Informational alerts
```

## Distributed Tracing

### Request ID Tracking

All requests automatically include X-Request-ID header for tracing:

```python
# Middleware automatically adds request ID
# Use for correlating logs and traces
```

### Jaeger/OpenTelemetry Integration

```python
# Optional: Add distributed tracing
from opentelemetry import trace, metrics
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter

jaeger_exporter = JaegerExporter(
    agent_host_name="localhost",
    agent_port=6831,
)
trace.set_tracer_provider(TracerProvider())
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)

tracer = trace.get_tracer(__name__)
```

## Frontend Monitoring

### Performance Monitoring

```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)  // Cumulative Layout Shift
getFID(console.log)  // First Input Delay
getFCP(console.log)  // First Contentful Paint
getLCP(console.log)  // Largest Contentful Paint
getTTFB(console.log) // Time to First Byte
```

### Error Tracking (Sentry Example)

```typescript
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```

## Dashboards

### Key Dashboards

1. **Service Health Dashboard**
   - Service status
   - API response times
   - Error rates
   - Database health

2. **Business Metrics Dashboard**
   - Active users
   - Donor registrations
   - Blood requests
   - Conversion rates

3. **Infrastructure Dashboard**
   - CPU/Memory usage
   - Disk usage
   - Network I/O
   - Container status

4. **Security Dashboard**
   - Failed login attempts
   - Rate limit violations
   - Unusual activity

## Capacity Planning

### Monitoring for Scaling Needs

```python
# Monitor these metrics over time
- Average CPU usage
- Peak CPU usage
- Memory trend
- Database query count
- Connection pool usage
```

### Thresholds for Action

- CPU > 70%: Consider scaling
- Memory > 80%: Add more resources
- Database connections > 80%: Add connection pooling
- Disk > 80%: Expand storage

## On-Call Procedures

### Runbook Example

**Alert**: HighErrorRate

1. **Acknowledge alert** in monitoring system
2. **Check logs** for patterns:
   ```bash
   kubectl logs -f deployment/lifelink-api | grep ERROR
   ```
3. **Check metrics**:
   - Error rate trend
   - Affected endpoints
   - Time of occurrence
4. **Check dependencies**:
   - Database status
   - External APIs
   - Cache status
5. **Incident response**:
   - If transient: Monitor and wait
   - If persistent: Rollback recent changes
   - Escalate if unresolved

## Documentation

- **SLA**: 99.5% uptime target
- **RTO**: Recovery Time Objective (4 hours)
- **RPO**: Recovery Point Objective (1 hour)
- **Response time**: < 200ms (p95)

## Tools & Stack

Recommended monitoring stack:
```
Logging:    ELK, Datadog, CloudWatch
Metrics:    Prometheus, Grafana
Tracing:    Jaeger, Lightstep
Errors:     Sentry, Rollbar
APM:        New Relic, DataDog
Uptime:     Pingdom, Uptime Robot
```

---

**Last Updated**: 2024
**Version**: 1.0.0
