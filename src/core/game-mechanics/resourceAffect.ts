import {resourceEffectTypes, ResourceTypes} from "../GameDataBase/resource.ts";

/**
 * 存储所有对Res生产消耗影响的东西
 * number为百分比，别太炸裂
 */
export const ResourceAffects: [ResourceTypes, resourceEffectTypes, number, string][] = []

