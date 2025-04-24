import Cookies from 'js-cookie';

/**
 * Cookie management utilities for the sign-up flow
 */

// Cookie names
export const COOKIE_NAMES = {
  EDIT_MODE: 'edit_mode',
  PERSONAL_STEP_COMPLETE: 'personal_step_complete',
  CALENDAR_STEP_COMPLETE: 'calendar_step_complete',
  AVAILABILITY_STEP_COMPLETE: 'availability_step_complete',
  PROFILE_STEP_COMPLETE: 'profile_step_complete',
  NEXT_STEP: 'next_step',
  ONBOARDING_COMPLETE: 'onboarding_complete'
};

// Cookie options
const DEFAULT_COOKIE_OPTIONS = {
  expires: 1, // 1 day
  path: '/'
};

export type StepType = 'personal' | 'calendar' | 'conferencing' | 'availability' | 'profile';

/**
 * Set the edit mode cookie to allow navigation to previous steps
 */
export const setEditMode = () => {
  Cookies.set(COOKIE_NAMES.EDIT_MODE, 'true', DEFAULT_COOKIE_OPTIONS);
};

/**
 * Clear the edit mode cookie
 */
export const clearEditMode = () => {
  Cookies.remove(COOKIE_NAMES.EDIT_MODE, { path: '/' });
};

/**
 * Set a step completion cookie
 * @param step The step that was completed
 */
export const setStepComplete = (step: StepType) => {
  const cookieName = `${step}_step_complete`;
  Cookies.set(cookieName, 'true', DEFAULT_COOKIE_OPTIONS);
};

/**
 * Set a temporary next step cookie for one-time navigation
 * @param nextStep The next step to navigate to
 */
export const setNextStep = (nextStep: string) => {
  Cookies.set(COOKIE_NAMES.NEXT_STEP, nextStep, DEFAULT_COOKIE_OPTIONS);
};

/**
 * Clear the next step cookie
 */
export const clearNextStep = () => {
  Cookies.remove(COOKIE_NAMES.NEXT_STEP, { path: '/' });
};

/**
 * Set the onboarding complete cookie and clear all onboarding-related cookies
 */
export const setOnboardingComplete = () => {
  // Clear all onboarding step cookies
  Cookies.remove(COOKIE_NAMES.NEXT_STEP, { path: '/' });
  Cookies.remove(COOKIE_NAMES.EDIT_MODE, { path: '/' });
  Cookies.remove(COOKIE_NAMES.PERSONAL_STEP_COMPLETE, { path: '/' });
  Cookies.remove(COOKIE_NAMES.CALENDAR_STEP_COMPLETE, { path: '/' });
  Cookies.remove(COOKIE_NAMES.AVAILABILITY_STEP_COMPLETE, { path: '/' });
  Cookies.remove(COOKIE_NAMES.PROFILE_STEP_COMPLETE, { path: '/' });

  // Set the onboarding complete cookie
  Cookies.set(COOKIE_NAMES.ONBOARDING_COMPLETE, 'true', DEFAULT_COOKIE_OPTIONS);
};

/**
 * Check if a specific step is complete
 * @param step The step to check
 * @returns boolean indicating if the step is complete
 */
export const isStepComplete = (step: StepType): boolean => {
  const cookieName = `${step}_step_complete`;
  return Cookies.get(cookieName) === 'true';
};

/**
 * Check if the user is in edit mode
 * @returns boolean indicating if the user is in edit mode
 */
export const isEditMode = (): boolean => {
  return Cookies.get(COOKIE_NAMES.EDIT_MODE) === 'true';
}; 