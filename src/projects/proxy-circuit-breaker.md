---
title: "Circuit breakers for a healthcare platform's proxy"
date: 2022-06-01
description: "One dead service could tie up the proxy that the Millennium platform's scripts called through. I added Resilience4j circuit breakers so it fails fast and recovers on its own."
category: Backend
keywords: [Java, Resilience4j, circuit breaker, Gatling, load testing, healthcare, reliability]
featured: true
# Proofread before launch: add what changed after release (fewer stuck connections, an incident it contained) if you remember.
---

## The problem

Cerner's Millennium platform had a proxy that production scripts called through to reach other services, with authorization kept intact on the way. If a downstream service was down, each call held its connection open for up to two minutes before it failed. When thousands of scripts called the same dead endpoint, those waiting connections piled up, and calls to healthy services slowed down with them.

## The fix

I added circuit breakers from Resilience4j, one per endpoint. A breaker has three states:

- Closed: calls go through, and failures are counted.
- Open: past a failure threshold, calls fail at once instead of waiting two minutes, which frees the proxy for the endpoints that work.
- Half-open: after a wait, a few calls go through to test the endpoint. If they succeed, the breaker closes again.

## Getting the numbers right

The thresholds came from failure logs captured during real incidents. To check them, I rebuilt those conditions in a lab environment and ran load tests with Gatling profiles, to confirm the settings and find flaws before production did.

## The part that wasn't code

Most backend services used the proxy, so even a small change in its behavior reached a lot of teams. Failing fast was new behavior, so I made sure the service owners knew what would change, and why, before it shipped.

## Results

The proxy kept serving healthy endpoints while a downstream service was down, instead of every call waiting out the timeout.
