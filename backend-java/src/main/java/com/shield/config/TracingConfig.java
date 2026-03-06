package com.shield.config;

import io.opentracing.Tracer;
import io.jaegertracing.Configuration;
import io.jaegertracing.internal.samplers.ConstSampler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

@org.springframework.context.annotation.Configuration
public class TracingConfig {

    @Value("${jaeger.service.name:shield-backend}")
    private String serviceName;

    @Value("${jaeger.agent.host:localhost}")
    private String agentHost;

    @Value("${jaeger.agent.port:6831}")
    private int agentPort;

    @Bean
    public Tracer jaegerTracer() {
        Configuration.SamplerConfiguration samplerConfig = 
            Configuration.SamplerConfiguration.fromEnv()
                .withType(ConstSampler.TYPE)
                .withParam(1);

        Configuration.ReporterConfiguration reporterConfig = 
            Configuration.ReporterConfiguration.fromEnv()
                .withLogSpans(true)
                .withSender(
                    Configuration.SenderConfiguration.fromEnv()
                        .withAgentHost(agentHost)
                        .withAgentPort(agentPort)
                );

        Configuration config = new Configuration(serviceName)
            .withSampler(samplerConfig)
            .withReporter(reporterConfig);

        return config.getTracer();
    }
}
