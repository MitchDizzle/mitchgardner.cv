---
title: "A deployment platform for 500+ microservices"
date: 2025-09-01
description: "At Oracle I ran the Spinnaker platform that 20+ teams used to ship 500+ microservices to AWS and OCI, and moved its most common failures to pull-request time."
category: Platform
keywords: [Spinnaker, Jenkins, GitHub Actions, Kubernetes, AWS, OCI, Ruby, CI/CD]
featured: true
# Proofread before launch: written from resume notes. Add one real example (an incident, a team you got unstuck) if you can.
---

From October 2022 to September 2025 I worked on Oracle's deployment platform: a Spinnaker setup, with Jenkins and GitHub Actions in front of it, that development teams used to ship more than 500 microservices to AWS and Oracle Cloud Infrastructure (OCI). Twenty-plus teams deployed through it every week.

## My part

I was the escalation point for 15+ service teams. When a deploy failed, or a team wasn't sure how to set one up, they came to me. I was also the main troubleshooter for container deployments on Kubernetes, including the problems that only showed up in one environment and not the next.

During high-priority incidents I coordinated rollbacks to keep services available. I onboarded teams from outside our organization onto the platform and set up the connections between their services and ours. And I helped move deployment environments from AWS to OCI, working on load balancing, debugging, and log aggregation.

## Catching mistakes at pull-request time

A lot of failed releases came from pipeline configuration mistakes that nobody saw until the deploy ran. I wrote Ruby scripts that ran on every pull request and checked the pipeline configuration before it merged, so a mistake failed in review instead of in a deployment. They cut failed releases and saved about four hours of redeploys a week.

I also built deployment tooling against the GitHub Enterprise and Spinnaker APIs.

## What I took from it

The cheapest place to catch a deploy problem is the pull request. Every check moved earlier saves somebody a rollback later.

A platform is as much about people as pipelines: the onboarding, the answers to "why did my deploy fail?", and being reachable when it fails at a bad time.
