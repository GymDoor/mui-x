import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _toPropertyKey from "@babel/runtime/helpers/esm/toPropertyKey";
import * as React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';

/**
 * Implement the Pipeline Pattern
 *
 * More information and detailed example in (TODO add link to technical doc when ready)
 *
 * Some plugins contains custom logic to enrich data provided by other plugins or components.
 * For instance, the row grouping plugin needs to add / remove the grouping columns when the grid columns are updated.
 *
 * =====================================================================================================================
 *
 * The plugin containing the custom logic must use:
 *
 * - `useGridRegisterPipeProcessor` to register their processor.
 *
 * - `apiRef.current.unstable_requestPipeProcessorsApplication` to imperatively re-apply a group.
 *   This method should be used in last resort.
 *   Most of the time, the application should be triggered by an update on the deps of the processor.
 *
 * =====================================================================================================================
 *
 * The plugin or component that needs to enrich its data must use:
 *
 * - `apiRef.current.unstable_applyPipeProcessors` to run in chain all the processors of a given group.
 *
 * - `useGridRegisterPipeApplier` to re-apply the whole pipe when requested.
 *   The applier will be called when:
 *   * a processor is registered.
 *   * `apiRef.current.unstable_requestPipeProcessorsApplication` is called for the given group.
 */
export const useGridPipeProcessing = apiRef => {
  const processorsCache = React.useRef({});
  const runAppliers = React.useCallback(groupCache => {
    if (!groupCache) {
      return;
    }

    Object.values(groupCache.appliers).forEach(callback => {
      callback();
    });
  }, []);
  const registerPipeProcessor = React.useCallback((group, id, processor) => {
    if (!processorsCache.current[group]) {
      processorsCache.current[group] = {
        processors: {},
        appliers: {}
      };
    }

    const groupCache = processorsCache.current[group];
    const oldProcessor = groupCache.processors[id];

    if (oldProcessor !== processor) {
      groupCache.processors[id] = processor;
      runAppliers(groupCache);
    }

    return () => {
      const _processors = processorsCache.current[group].processors,
            otherProcessors = _objectWithoutPropertiesLoose(_processors, [id].map(_toPropertyKey));

      processorsCache.current[group].processors = otherProcessors;
    };
  }, [runAppliers]);
  const registerPipeApplier = React.useCallback((group, id, applier) => {
    if (!processorsCache.current[group]) {
      processorsCache.current[group] = {
        processors: {},
        appliers: {}
      };
    }

    processorsCache.current[group].appliers[id] = applier;
    return () => {
      const _appliers = processorsCache.current[group].appliers,
            otherAppliers = _objectWithoutPropertiesLoose(_appliers, [id].map(_toPropertyKey));

      processorsCache.current[group].appliers = otherAppliers;
    };
  }, []);
  const requestPipeProcessorsApplication = React.useCallback(group => {
    const groupCache = processorsCache.current[group];
    runAppliers(groupCache);
  }, [runAppliers]);
  const applyPipeProcessors = React.useCallback((...args) => {
    const [group, value, context] = args;

    if (!processorsCache.current[group]) {
      return value;
    }

    const preProcessors = Object.values(processorsCache.current[group].processors);
    return preProcessors.reduce((acc, preProcessor) => {
      return preProcessor(acc, context);
    }, value);
  }, []);
  const preProcessingApi = {
    unstable_registerPipeProcessor: registerPipeProcessor,
    unstable_registerPipeApplier: registerPipeApplier,
    unstable_requestPipeProcessorsApplication: requestPipeProcessorsApplication,
    unstable_applyPipeProcessors: applyPipeProcessors
  };
  useGridApiMethod(apiRef, preProcessingApi, 'GridPipeProcessingApi');
};