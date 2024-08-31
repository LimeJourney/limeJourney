/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SwaggerController } from './../../controllers/private/swaggerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SegmentController } from './../../controllers/private/segmentationController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OrganizationController } from './../../controllers/private/orgController';
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
    "_36_Enums.SubscriptionStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ACTIVE"]},{"dataType":"enum","enums":["INACTIVE"]},{"dataType":"enum","enums":["PAST_DUE"]},{"dataType":"enum","enums":["CANCELLED"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection_Prisma._36_OrganizationPayload_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"updatedAt":{"dataType":"datetime","required":true},"createdAt":{"dataType":"datetime","required":true},"subscriptionPeriodEnd":{"dataType":"datetime","required":true},"subscriptionPeriodStart":{"dataType":"datetime","required":true},"planId":{"dataType":"string","required":true},"subscriptionStatus":{"ref":"_36_Enums.SubscriptionStatus","required":true},"subscriptionId":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Organization": {
        "dataType": "refAlias",
        "type": {"ref":"DefaultSelection_Prisma._36_OrganizationPayload_","validators":{}},
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
    "_36_Enums.InvitationStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["PENDING"]},{"dataType":"enum","enums":["ACCEPTED"]},{"dataType":"enum","enums":["REJECTED"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection_Prisma._36_InvitationPayload_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"updatedAt":{"dataType":"datetime","required":true},"createdAt":{"dataType":"datetime","required":true},"expiresAt":{"dataType":"datetime","required":true},"status":{"ref":"_36_Enums.InvitationStatus","required":true},"invitedBy":{"dataType":"string","required":true},"organizationId":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Invitation": {
        "dataType": "refAlias",
        "type": {"ref":"DefaultSelection_Prisma._36_InvitationPayload_","validators":{}},
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
    "_36_Enums.UserRole": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ADMIN"]},{"dataType":"enum","enums":["MEMBER"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection_Prisma._36_OrganizationMemberPayload_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"updatedAt":{"dataType":"datetime","required":true},"createdAt":{"dataType":"datetime","required":true},"role":{"ref":"_36_Enums.UserRole","required":true},"organizationId":{"dataType":"string","required":true},"userId":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrganizationMember": {
        "dataType": "refAlias",
        "type": {"ref":"DefaultSelection_Prisma._36_OrganizationMemberPayload_","validators":{}},
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
