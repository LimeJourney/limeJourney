/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TemplateController } from './../../controllers/private/templateController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SwaggerController } from './../../controllers/private/swaggerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SegmentController } from './../../controllers/private/segmentationController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OrganizationController } from './../../controllers/private/orgController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MessagingProfileController } from './../../controllers/private/messagingProfileController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminMessagingController } from './../../controllers/private/messagingIntegrationController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { JourneyManagementController } from './../../controllers/private/journeyController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AIInsightsController } from './../../controllers/private/insightsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EventController } from './../../controllers/private/eventsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EntityController } from './../../controllers/private/entitiesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../../controllers/private/authController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ApiKeyController } from './../../controllers/private/apiKeyController';
import { expressAuthentication } from './../../services/jwtAuthentication';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ChannelType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["EMAIL"]},{"dataType":"enum","enums":["SMS"]},{"dataType":"enum","enums":["PUSH"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TemplateStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["DRAFT"]},{"dataType":"enum","enums":["ACTIVE"]},{"dataType":"enum","enums":["ARCHIVED"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Template": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "channel": {"ref":"ChannelType","required":true},
            "subjectLine": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "previewText": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "content": {"dataType":"string","required":true},
            "tags": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "status": {"ref":"TemplateStatus","required":true},
            "messagingProfileId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "organizationId": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_Template_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"Template"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_null_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":[null]},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateTemplateRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "channel": {"ref":"ChannelType","required":true},
            "subjectLine": {"dataType":"string","required":true},
            "previewText": {"dataType":"string","required":true},
            "content": {"dataType":"string","required":true},
            "tags": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "status": {"ref":"TemplateStatus","required":true},
            "messagingProfileId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateTemplateRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "channel": {"ref":"ChannelType"},
            "subjectLine": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "previewText": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "content": {"dataType":"string"},
            "tags": {"dataType":"array","array":{"dataType":"string"}},
            "status": {"ref":"TemplateStatus"},
            "messagingProfileId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_Template-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"Template"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SegmentCriterionType": {
        "dataType": "refEnum",
        "enums": ["property","event"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SegmentOperator": {
        "dataType": "refEnum",
        "enums": ["equals","not_equals","greater_than","less_than","contains","not_contains","in","not_in","between","not_between","has_done","has_not_done","has_done_times","has_done_first_time","has_done_last_time","has_done_within","has_not_done_within"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SegmentCriterion": {
        "dataType": "refObject",
        "properties": {
            "type": {"ref":"SegmentCriterionType","required":true},
            "field": {"dataType":"string","required":true},
            "operator": {"ref":"SegmentOperator","required":true},
            "value": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"},{"dataType":"boolean"}],"required":true},
            "timeUnit": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["minutes"]},{"dataType":"enum","enums":["hours"]},{"dataType":"enum","enums":["days"]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LogicalOperator": {
        "dataType": "refEnum",
        "enums": ["and","or"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SegmentCondition": {
        "dataType": "refObject",
        "properties": {
            "criteria": {"dataType":"array","array":{"dataType":"refObject","ref":"SegmentCriterion"},"required":true},
            "logicalOperator": {"ref":"LogicalOperator","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Segment": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "organizationId": {"dataType":"string","required":true},
            "conditions": {"dataType":"array","array":{"dataType":"refObject","ref":"SegmentCondition"},"required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_Segment_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"Segment"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateSegmentDTO": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "conditions": {"dataType":"array","array":{"dataType":"refObject","ref":"SegmentCondition"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateSegmentDTO": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "description": {"dataType":"string"},
            "conditions": {"dataType":"array","array":{"dataType":"refObject","ref":"SegmentCondition"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_boolean_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"boolean"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_Segment-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"Segment"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_string-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"string"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SegmentAnalytics": {
        "dataType": "refObject",
        "properties": {
            "segmentId": {"dataType":"string","required":true},
            "size": {"dataType":"double","required":true},
            "growthRate": {"dataType":"double","required":true},
            "commonCharacteristics": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},"required":true},
            "conversionRate": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_SegmentAnalytics_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"SegmentAnalytics"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubscriptionStatus": {
        "dataType": "refEnum",
        "enums": ["ACTIVE","INACTIVE","PAST_DUE","CANCELLED"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Organization": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"updatedAt":{"dataType":"datetime","required":true},"createdAt":{"dataType":"datetime","required":true},"subscriptionPeriodEnd":{"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}]},"subscriptionPeriodStart":{"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}]},"planId":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"subscriptionStatus":{"ref":"SubscriptionStatus","required":true},"subscriptionId":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_Organization-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refAlias","ref":"Organization"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_void_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"void"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_Organization_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"Organization"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InvitationStatus": {
        "dataType": "refEnum",
        "enums": ["PENDING","ACCEPTED","REJECTED"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Invitation": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"updatedAt":{"dataType":"datetime","required":true},"createdAt":{"dataType":"datetime","required":true},"expiresAt":{"dataType":"datetime","required":true},"status":{"ref":"InvitationStatus","required":true},"invitedBy":{"dataType":"string","required":true},"organizationId":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_Invitation_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"Invitation"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserRole": {
        "dataType": "refEnum",
        "enums": ["ADMIN","MEMBER"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrganizationMember": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"updatedAt":{"dataType":"datetime","required":true},"createdAt":{"dataType":"datetime","required":true},"role":{"ref":"UserRole","required":true},"organizationId":{"dataType":"string","required":true},"userId":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_OrganizationMember_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"OrganizationMember"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AcceptInvitationDto": {
        "dataType": "refObject",
        "properties": {
            "invitationId": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Prisma.JsonValue": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"},{"dataType":"boolean"},{"ref":"Prisma.JsonObject"},{"ref":"Prisma.JsonArray"},{"dataType":"enum","enums":[null]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Prisma.JsonObject": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"Prisma.JsonValue"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Prisma.JsonArray": {
        "dataType": "refObject",
        "properties": {
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessagingProfile": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"updatedAt":{"dataType":"datetime","required":true},"createdAt":{"dataType":"datetime","required":true},"status":{"dataType":"string","required":true},"credentials":{"ref":"Prisma.JsonValue","required":true},"requiredFields":{"ref":"Prisma.JsonValue","required":true},"integrationId":{"dataType":"string","required":true},"organizationId":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_MessagingProfile_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"MessagingProfile"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_MessagingProfile.Exclude_keyofMessagingProfile.id-or-createdAt-or-updatedAt-or-organizationId__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"integrationId":{"dataType":"string","required":true},"requiredFields":{"ref":"Prisma.JsonValue","required":true},"credentials":{"ref":"Prisma.JsonValue","required":true},"status":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_MessagingProfile.id-or-createdAt-or-updatedAt-or-organizationId_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_MessagingProfile.Exclude_keyofMessagingProfile.id-or-createdAt-or-updatedAt-or-organizationId__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.string_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"string"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateMessagingProfileInput": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_MessagingProfile.id-or-createdAt-or-updatedAt-or-organizationId_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"requiredFields":{"ref":"Record_string.string_","required":true},"credentials":{"ref":"Record_string.string_","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessagingIntegration": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"updatedAt":{"dataType":"datetime","required":true},"createdAt":{"dataType":"datetime","required":true},"confidentialFields":{"ref":"Record_string.string_","required":true},"requiredFields":{"ref":"Record_string.string_","required":true},"providerName":{"dataType":"string","required":true},"type":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_MessagingIntegration-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refAlias","ref":"MessagingIntegration"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_MessagingProfile-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refAlias","ref":"MessagingProfile"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_CreateMessagingProfileInput_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"integrationId":{"dataType":"string"},"requiredFields":{"dataType":"intersection","subSchemas":[{"ref":"Prisma.JsonValue"},{"ref":"Record_string.string_"}]},"credentials":{"dataType":"intersection","subSchemas":[{"ref":"Prisma.JsonValue"},{"ref":"Record_string.string_"}]},"status":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection_Prisma._36_MessageLogPayload_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"createdAt":{"dataType":"datetime","required":true},"metadata":{"ref":"Prisma.JsonValue","required":true},"status":{"dataType":"string","required":true},"event":{"dataType":"string","required":true},"messagingProfileId":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageLog": {
        "dataType": "refAlias",
        "type": {"ref":"DefaultSelection_Prisma._36_MessageLogPayload_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_MessageLog-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refAlias","ref":"MessageLog"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_any_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"any"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_MessagingIntegration_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"MessagingIntegration"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateMessagingIntegrationInput": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "providerName": {"dataType":"string","required":true},
            "requiredFields": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "confidentialFields": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateMessagingIntegrationInput": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "providerName": {"dataType":"string"},
            "requiredFields": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourneyNode": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "data": {"dataType":"any","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourneyEdge": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "source": {"dataType":"string","required":true},
            "target": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourneyDefinition": {
        "dataType": "refObject",
        "properties": {
            "nodes": {"dataType":"array","array":{"dataType":"refObject","ref":"JourneyNode"},"required":true},
            "edges": {"dataType":"array","array":{"dataType":"refObject","ref":"JourneyEdge"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_CreateJourneyDTO.Exclude_keyofCreateJourneyDTO.organizationId__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"status":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["DRAFT"]},{"dataType":"enum","enums":["ACTIVE"]},{"dataType":"enum","enums":["ARCHIVED"]},{"dataType":"enum","enums":["PAUSED"]}]},"definition":{"ref":"JourneyDefinition","required":true},"runMultipleTimes":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_CreateJourneyDTO.organizationId_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_CreateJourneyDTO.Exclude_keyofCreateJourneyDTO.organizationId__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_UpdateJourneyDTO.Exclude_keyofUpdateJourneyDTO.organizationId-or-id__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"status":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["DRAFT"]},{"dataType":"enum","enums":["ACTIVE"]},{"dataType":"enum","enums":["ARCHIVED"]},{"dataType":"enum","enums":["PAUSED"]}]}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_UpdateJourneyDTO.organizationId-or-id_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_UpdateJourneyDTO.Exclude_keyofUpdateJourneyDTO.organizationId-or-id__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.JourneyStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["DRAFT"]},{"dataType":"enum","enums":["ACTIVE"]},{"dataType":"enum","enums":["ARCHIVED"]},{"dataType":"enum","enums":["PAUSED"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection_Prisma._36_JourneyPayload_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"runMultipleTimes":{"dataType":"boolean","required":true},"updatedAt":{"dataType":"datetime","required":true},"createdAt":{"dataType":"datetime","required":true},"status":{"ref":"_36_Enums.JourneyStatus","required":true},"definition":{"ref":"Prisma.JsonValue","required":true},"organizationId":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourneyWithMetrics": {
        "dataType": "refObject",
        "properties": {
            "runMultipleTimes": {"dataType":"boolean","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "status": {"ref":"_36_Enums.JourneyStatus","required":true},
            "definition": {"ref":"Prisma.JsonValue","required":true},
            "organizationId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "id": {"dataType":"string","required":true},
            "metrics": {"dataType":"nestedObjectLiteral","nestedProperties":{"completionRate":{"dataType":"double","required":true},"totalUsers":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_JourneyWithMetrics-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"JourneyWithMetrics"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StepMetric": {
        "dataType": "refObject",
        "properties": {
            "total": {"dataType":"double","required":true},
            "completed": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourneyMetrics": {
        "dataType": "refObject",
        "properties": {
            "totalUsers": {"dataType":"double","required":true},
            "completedUsers": {"dataType":"double","required":true},
            "completionRate": {"dataType":"double","required":true},
            "averageCompletionTime": {"dataType":"double","required":true},
            "stepMetrics": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"StepMetric"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_JourneyMetrics_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"JourneyMetrics"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourneyActivity": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "userId": {"dataType":"string","required":true},
            "nodeId": {"dataType":"string","required":true},
            "nodeName": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "timestamp": {"dataType":"datetime","required":true},
            "data": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_JourneyActivity-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"JourneyActivity"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse__activities-JourneyActivity-Array--totalCount-number__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"totalCount":{"dataType":"double","required":true},"activities":{"dataType":"array","array":{"dataType":"refObject","ref":"JourneyActivity"},"required":true}}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse___91_key-string_93__58_number__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"double"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InsightResponse": {
        "dataType": "refObject",
        "properties": {
            "insight": {"dataType":"string","required":true},
            "confidence": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_InsightResponse_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"InsightResponse"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InsightQuery": {
        "dataType": "refObject",
        "properties": {
            "query": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecentQuery": {
        "dataType": "refObject",
        "properties": {
            "query": {"dataType":"string","required":true},
            "response": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_OrganizationInsights-at-recentQueries_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"RecentQuery"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrganizationInsights": {
        "dataType": "refObject",
        "properties": {
            "recentQueries": {"dataType":"array","array":{"dataType":"refObject","ref":"RecentQuery"},"required":true},
            "uniqueEvents": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"double"},"required":true},
            "totalEntities": {"dataType":"double","required":true},
            "totalEvents": {"dataType":"double","required":true},
            "averageEventsPerEntity": {"dataType":"double","required":true},
            "activeEntitiesLast30Days": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_OrganizationInsights_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"OrganizationInsights"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.any_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EventData": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "org_id": {"dataType":"string","required":true},
            "entity_id": {"dataType":"string","required":true},
            "entity_external_id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "properties": {"ref":"Record_string.any_","required":true},
            "timestamp": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_EventData_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"EventData"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecordEventRequest": {
        "dataType": "refObject",
        "properties": {
            "entity_external_id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "properties": {"ref":"Record_string.any_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_EventData-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"EventData"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EntityData": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "org_id": {"dataType":"string","required":true},
            "external_id": {"dataType":"string"},
            "properties": {"ref":"Record_string.any_","required":true},
            "created_at": {"dataType":"string","required":true},
            "updated_at": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_EntityData_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"EntityData"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateOrUpdateEntityRequest": {
        "dataType": "refObject",
        "properties": {
            "external_id": {"dataType":"string"},
            "properties": {"ref":"Record_string.any_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EntityWithSegments": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "org_id": {"dataType":"string","required":true},
            "external_id": {"dataType":"string"},
            "properties": {"ref":"Record_string.any_","required":true},
            "created_at": {"dataType":"string","required":true},
            "updated_at": {"dataType":"string","required":true},
            "segments": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"createdAt":{"dataType":"datetime","required":true},"description":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_EntityWithSegments_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"EntityWithSegments"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_EntityWithSegments-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"EntityWithSegments"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_EntityData-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"EntityData"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse__totalEntities-number--oldestEntity-string--newestEntity-string--uniqueExternalIds-number__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"uniqueExternalIds":{"dataType":"double","required":true},"newestEntity":{"dataType":"string","required":true},"oldestEntity":{"dataType":"string","required":true},"totalEntities":{"dataType":"double","required":true}}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthData": {
        "dataType": "refObject",
        "properties": {
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"role":{"dataType":"string","required":true},"organizationId":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
            "token": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_AuthData_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"AuthData"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string"},
            "name": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiKey": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "key": {"dataType":"string","required":true},
            "organizationId": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "lastUsedAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "expiresAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "isActive": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_ApiKey_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"ref":"ApiKey"},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GenerateApiKeyRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponse_ApiKey-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["success"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refObject","ref":"ApiKey"}},{"dataType":"enum","enums":[null]}],"required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        app.post('/api/internal/v1/templates',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TemplateController)),
            ...(fetchMiddlewares<RequestHandler>(TemplateController.prototype.createTemplate)),

            async function TemplateController_createTemplate(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateTemplateRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TemplateController();

              await templateService.apiHandler({
                methodName: 'createTemplate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/templates/:templateId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TemplateController)),
            ...(fetchMiddlewares<RequestHandler>(TemplateController.prototype.getTemplate)),

            async function TemplateController_getTemplate(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    templateId: {"in":"path","name":"templateId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    notFoundResponse: {"in":"res","name":"404","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TemplateController();

              await templateService.apiHandler({
                methodName: 'getTemplate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/internal/v1/templates/:templateId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TemplateController)),
            ...(fetchMiddlewares<RequestHandler>(TemplateController.prototype.updateTemplate)),

            async function TemplateController_updateTemplate(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    templateId: {"in":"path","name":"templateId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateTemplateRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    notFoundResponse: {"in":"res","name":"404","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TemplateController();

              await templateService.apiHandler({
                methodName: 'updateTemplate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/templates',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TemplateController)),
            ...(fetchMiddlewares<RequestHandler>(TemplateController.prototype.getTemplates)),

            async function TemplateController_getTemplates(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
                    limit: {"in":"query","name":"limit","dataType":"double"},
                    offset: {"in":"query","name":"offset","dataType":"double"},
                    channel: {"in":"query","name":"channel","ref":"ChannelType"},
                    status: {"in":"query","name":"status","ref":"TemplateStatus"},
                    search: {"in":"query","name":"search","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TemplateController();

              await templateService.apiHandler({
                methodName: 'getTemplates',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/internal/v1/templates/:templateId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TemplateController)),
            ...(fetchMiddlewares<RequestHandler>(TemplateController.prototype.deleteTemplate)),

            async function TemplateController_deleteTemplate(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    templateId: {"in":"path","name":"templateId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    notFoundResponse: {"in":"res","name":"404","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TemplateController();

              await templateService.apiHandler({
                methodName: 'deleteTemplate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/templates/:templateId/duplicate',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TemplateController)),
            ...(fetchMiddlewares<RequestHandler>(TemplateController.prototype.duplicateTemplate)),

            async function TemplateController_duplicateTemplate(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    templateId: {"in":"path","name":"templateId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    notFoundResponse: {"in":"res","name":"404","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new TemplateController();

              await templateService.apiHandler({
                methodName: 'duplicateTemplate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/docs',
            ...(fetchMiddlewares<RequestHandler>(SwaggerController)),
            ...(fetchMiddlewares<RequestHandler>(SwaggerController.prototype.getSwaggerUI)),

            async function SwaggerController_getSwaggerUI(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SwaggerController();

              await templateService.apiHandler({
                methodName: 'getSwaggerUI',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/segments',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SegmentController)),
            ...(fetchMiddlewares<RequestHandler>(SegmentController.prototype.createSegment)),

            async function SegmentController_createSegment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateSegmentDTO"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SegmentController();

              await templateService.apiHandler({
                methodName: 'createSegment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/segments/:segmentId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SegmentController)),
            ...(fetchMiddlewares<RequestHandler>(SegmentController.prototype.getSegment)),

            async function SegmentController_getSegment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    segmentId: {"in":"path","name":"segmentId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SegmentController();

              await templateService.apiHandler({
                methodName: 'getSegment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/internal/v1/segments/:segmentId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SegmentController)),
            ...(fetchMiddlewares<RequestHandler>(SegmentController.prototype.updateSegment)),

            async function SegmentController_updateSegment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    segmentId: {"in":"path","name":"segmentId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateSegmentDTO"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SegmentController();

              await templateService.apiHandler({
                methodName: 'updateSegment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/internal/v1/segments/:segmentId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SegmentController)),
            ...(fetchMiddlewares<RequestHandler>(SegmentController.prototype.deleteSegment)),

            async function SegmentController_deleteSegment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    segmentId: {"in":"path","name":"segmentId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SegmentController();

              await templateService.apiHandler({
                methodName: 'deleteSegment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/segments',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SegmentController)),
            ...(fetchMiddlewares<RequestHandler>(SegmentController.prototype.listSegments)),

            async function SegmentController_listSegments(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SegmentController();

              await templateService.apiHandler({
                methodName: 'listSegments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/segments/:segmentId/entities',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SegmentController)),
            ...(fetchMiddlewares<RequestHandler>(SegmentController.prototype.getEntitiesInSegment)),

            async function SegmentController_getEntitiesInSegment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    segmentId: {"in":"path","name":"segmentId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SegmentController();

              await templateService.apiHandler({
                methodName: 'getEntitiesInSegment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/segments/:segmentId/analytics',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SegmentController)),
            ...(fetchMiddlewares<RequestHandler>(SegmentController.prototype.getSegmentAnalytics)),

            async function SegmentController_getSegmentAnalytics(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    segmentId: {"in":"path","name":"segmentId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SegmentController();

              await templateService.apiHandler({
                methodName: 'getSegmentAnalytics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/segments/entity/:entityId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SegmentController)),
            ...(fetchMiddlewares<RequestHandler>(SegmentController.prototype.getSegmentsForEntity)),

            async function SegmentController_getSegmentsForEntity(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    entityId: {"in":"path","name":"entityId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SegmentController();

              await templateService.apiHandler({
                methodName: 'getSegmentsForEntity',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/organizations',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.listOrganizations)),

            async function OrganizationController_listOrganizations(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'listOrganizations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/internal/v1/organizations/switch/:organizationId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.switchOrganization)),

            async function OrganizationController_switchOrganization(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'switchOrganization',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/organizations',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.createOrganization)),

            async function OrganizationController_createOrganization(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'createOrganization',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/internal/v1/organizations/:organizationId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.updateOrganization)),

            async function OrganizationController_updateOrganization(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'updateOrganization',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/organizations/:organizationId/invite',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.inviteUser)),

            async function OrganizationController_inviteUser(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'inviteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/organizations/accept-invitation',
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.acceptInvitation)),

            async function OrganizationController_acceptInvitation(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"AcceptInvitationDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'acceptInvitation',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/messaging-profiles',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController)),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController.prototype.createProfile)),

            async function MessagingProfileController_createProfile(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateMessagingProfileInput"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MessagingProfileController();

              await templateService.apiHandler({
                methodName: 'createProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/messaging-profiles/integrations',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController)),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController.prototype.getIntegrations)),

            async function MessagingProfileController_getIntegrations(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MessagingProfileController();

              await templateService.apiHandler({
                methodName: 'getIntegrations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/messaging-profiles',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController)),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController.prototype.getProfiles)),

            async function MessagingProfileController_getProfiles(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MessagingProfileController();

              await templateService.apiHandler({
                methodName: 'getProfiles',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/messaging-profiles/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController)),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController.prototype.getProfileById)),

            async function MessagingProfileController_getProfileById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MessagingProfileController();

              await templateService.apiHandler({
                methodName: 'getProfileById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/internal/v1/messaging-profiles/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController)),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController.prototype.updateProfile)),

            async function MessagingProfileController_updateProfile(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"Partial_CreateMessagingProfileInput_"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MessagingProfileController();

              await templateService.apiHandler({
                methodName: 'updateProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/internal/v1/messaging-profiles/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController)),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController.prototype.deleteProfile)),

            async function MessagingProfileController_deleteProfile(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MessagingProfileController();

              await templateService.apiHandler({
                methodName: 'deleteProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/messaging-profiles/:id/logs',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController)),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController.prototype.getProfileLogs)),

            async function MessagingProfileController_getProfileLogs(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MessagingProfileController();

              await templateService.apiHandler({
                methodName: 'getProfileLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/messaging-profiles/:id/analytics',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController)),
            ...(fetchMiddlewares<RequestHandler>(MessagingProfileController.prototype.getProfileAnalytics)),

            async function MessagingProfileController_getProfileAnalytics(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    startDate: {"in":"query","name":"startDate","required":true,"dataType":"string"},
                    endDate: {"in":"query","name":"endDate","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MessagingProfileController();

              await templateService.apiHandler({
                methodName: 'getProfileAnalytics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/admin/messaging-integrations',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminMessagingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminMessagingController.prototype.createIntegration)),

            async function AdminMessagingController_createIntegration(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateMessagingIntegrationInput"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AdminMessagingController();

              await templateService.apiHandler({
                methodName: 'createIntegration',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/admin/messaging-integrations',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminMessagingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminMessagingController.prototype.getIntegrations)),

            async function AdminMessagingController_getIntegrations(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AdminMessagingController();

              await templateService.apiHandler({
                methodName: 'getIntegrations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/internal/v1/admin/messaging-integrations/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminMessagingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminMessagingController.prototype.updateIntegration)),

            async function AdminMessagingController_updateIntegration(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateMessagingIntegrationInput"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AdminMessagingController();

              await templateService.apiHandler({
                methodName: 'updateIntegration',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/internal/v1/admin/messaging-integrations/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminMessagingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminMessagingController.prototype.deleteIntegration)),

            async function AdminMessagingController_deleteIntegration(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AdminMessagingController();

              await templateService.apiHandler({
                methodName: 'deleteIntegration',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/journeys',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController)),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController.prototype.createJourney)),

            async function JourneyManagementController_createJourney(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"Omit_CreateJourneyDTO.organizationId_"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JourneyManagementController();

              await templateService.apiHandler({
                methodName: 'createJourney',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/api/internal/v1/journeys/:journeyId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController)),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController.prototype.updateJourney)),

            async function JourneyManagementController_updateJourney(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    journeyId: {"in":"path","name":"journeyId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"Omit_UpdateJourneyDTO.organizationId-or-id_"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JourneyManagementController();

              await templateService.apiHandler({
                methodName: 'updateJourney',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/journeys',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController)),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController.prototype.listJourneys)),

            async function JourneyManagementController_listJourneys(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
                    status: {"in":"query","name":"status","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JourneyManagementController();

              await templateService.apiHandler({
                methodName: 'listJourneys',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/journeys/:journeyId/metrics',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController)),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController.prototype.getJourneyMetrics)),

            async function JourneyManagementController_getJourneyMetrics(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    journeyId: {"in":"path","name":"journeyId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JourneyManagementController();

              await templateService.apiHandler({
                methodName: 'getJourneyMetrics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/journeys/:journeyId/activity/recent',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController)),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController.prototype.getRecentJourneyActivity)),

            async function JourneyManagementController_getRecentJourneyActivity(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    journeyId: {"in":"path","name":"journeyId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
                    limit: {"in":"query","name":"limit","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JourneyManagementController();

              await templateService.apiHandler({
                methodName: 'getRecentJourneyActivity',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/journeys/:journeyId/activity/feed',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController)),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController.prototype.getJourneyActivityFeed)),

            async function JourneyManagementController_getJourneyActivityFeed(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    journeyId: {"in":"path","name":"journeyId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
                    page: {"in":"query","name":"page","dataType":"double"},
                    pageSize: {"in":"query","name":"pageSize","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JourneyManagementController();

              await templateService.apiHandler({
                methodName: 'getJourneyActivityFeed',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/journeys/:journeyId/activity/summary',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController)),
            ...(fetchMiddlewares<RequestHandler>(JourneyManagementController.prototype.getJourneyActivitySummary)),

            async function JourneyManagementController_getJourneyActivitySummary(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    journeyId: {"in":"path","name":"journeyId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
                    timeframe: {"in":"query","name":"timeframe","dataType":"union","subSchemas":[{"dataType":"enum","enums":["day"]},{"dataType":"enum","enums":["week"]},{"dataType":"enum","enums":["month"]}]},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new JourneyManagementController();

              await templateService.apiHandler({
                methodName: 'getJourneyActivitySummary',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/insights/query',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AIInsightsController)),
            ...(fetchMiddlewares<RequestHandler>(AIInsightsController.prototype.getInsights)),

            async function AIInsightsController_getInsights(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"InsightQuery"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AIInsightsController();

              await templateService.apiHandler({
                methodName: 'getInsights',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/insights/queries',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AIInsightsController)),
            ...(fetchMiddlewares<RequestHandler>(AIInsightsController.prototype.getRecentQueries)),

            async function AIInsightsController_getRecentQueries(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AIInsightsController();

              await templateService.apiHandler({
                methodName: 'getRecentQueries',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/insights',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AIInsightsController)),
            ...(fetchMiddlewares<RequestHandler>(AIInsightsController.prototype.getOrganizationInsights)),

            async function AIInsightsController_getOrganizationInsights(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AIInsightsController();

              await templateService.apiHandler({
                methodName: 'getOrganizationInsights',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/events',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.recordEvent)),

            async function EventController_recordEvent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"RecordEventRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'recordEvent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/events',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.getEvents)),

            async function EventController_getEvents(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
                    entityId: {"in":"query","name":"entityId","dataType":"string"},
                    limit: {"in":"query","name":"limit","dataType":"double"},
                    offset: {"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'getEvents',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/events/search',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.searchEvents)),

            async function EventController_searchEvents(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    searchQuery: {"in":"query","name":"searchQuery","required":true,"dataType":"string"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
                    limit: {"in":"query","name":"limit","dataType":"double"},
                    offset: {"in":"query","name":"offset","dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'searchEvents',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/events/names',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.getUniqueEventNames)),

            async function EventController_getUniqueEventNames(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'getUniqueEventNames',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/entities/list/entity_properties',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EntityController)),
            ...(fetchMiddlewares<RequestHandler>(EntityController.prototype.getEntityProperties)),

            async function EntityController_getEntityProperties(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EntityController();

              await templateService.apiHandler({
                methodName: 'getEntityProperties',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/entities',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EntityController)),
            ...(fetchMiddlewares<RequestHandler>(EntityController.prototype.createOrUpdateEntity)),

            async function EntityController_createOrUpdateEntity(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateOrUpdateEntityRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EntityController();

              await templateService.apiHandler({
                methodName: 'createOrUpdateEntity',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/entities/:entityId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EntityController)),
            ...(fetchMiddlewares<RequestHandler>(EntityController.prototype.getEntity)),

            async function EntityController_getEntity(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    entityId: {"in":"path","name":"entityId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    notFoundResponse: {"in":"res","name":"404","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EntityController();

              await templateService.apiHandler({
                methodName: 'getEntity',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/entities',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EntityController)),
            ...(fetchMiddlewares<RequestHandler>(EntityController.prototype.listEntities)),

            async function EntityController_listEntities(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    notFoundResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EntityController();

              await templateService.apiHandler({
                methodName: 'listEntities',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/entities/:entityId/events',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EntityController)),
            ...(fetchMiddlewares<RequestHandler>(EntityController.prototype.getEntityEvents)),

            async function EntityController_getEntityEvents(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    entityId: {"in":"path","name":"entityId","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    notFoundResponse: {"in":"res","name":"404","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EntityController();

              await templateService.apiHandler({
                methodName: 'getEntityEvents',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/entities/search',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EntityController)),
            ...(fetchMiddlewares<RequestHandler>(EntityController.prototype.searchEntities)),

            async function EntityController_searchEntities(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    searchQuery: {"in":"query","name":"searchQuery","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    badRequestResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EntityController();

              await templateService.apiHandler({
                methodName: 'searchEntities',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/entities/stats',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EntityController)),
            ...(fetchMiddlewares<RequestHandler>(EntityController.prototype.getEntityStats)),

            async function EntityController_getEntityStats(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EntityController();

              await templateService.apiHandler({
                methodName: 'getEntityStats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/auth/authenticate',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.authenticate)),

            async function AuthController_authenticate(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"AuthRequest"},
                    notFoundResponse: {"in":"res","name":"400","required":true,"ref":"ApiResponse_null_"},
                    serverErrorResponse: {"in":"res","name":"500","required":true,"ref":"ApiResponse_null_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'authenticate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/auth/google',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.googleAuth)),

            async function AuthController_googleAuth(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'googleAuth',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 302,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/auth/google/callback',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.googleAuthCallback)),

            async function AuthController_googleAuthCallback(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'googleAuthCallback',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 302,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/internal/v1/api-keys',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ApiKeyController)),
            ...(fetchMiddlewares<RequestHandler>(ApiKeyController.prototype.generateApiKey)),

            async function ApiKeyController_generateApiKey(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"GenerateApiKeyRequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ApiKeyController();

              await templateService.apiHandler({
                methodName: 'generateApiKey',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/internal/v1/api-keys',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ApiKeyController)),
            ...(fetchMiddlewares<RequestHandler>(ApiKeyController.prototype.getApiKeys)),

            async function ApiKeyController_getApiKeys(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ApiKeyController();

              await templateService.apiHandler({
                methodName: 'getApiKeys',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/internal/v1/api-keys/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ApiKeyController)),
            ...(fetchMiddlewares<RequestHandler>(ApiKeyController.prototype.deleteApiKey)),

            async function ApiKeyController_deleteApiKey(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ApiKeyController();

              await templateService.apiHandler({
                methodName: 'deleteApiKey',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
