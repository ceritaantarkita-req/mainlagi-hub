/**
 * @deprecated Replaced by {@link PenMapper} in `./pen-mapper`.
 *
 * The relative, trackpad-style mapper integrated hand velocity into a cursor
 * position. That accumulated tracking jitter without ever correcting it, so
 * the pen drifted while writing: straight lines bent and circles failed to
 * close. Handwriting needs absolute mapping, which is what `PenMapper` does.
 *
 * This module is kept only so that any external import keeps compiling. It can
 * be deleted once nothing references it.
 */
export { PenMapper as RelativeHandMapper } from "./pen-mapper";
export type { PenMapperOptions as RelativeHandMapperOptions } from "./pen-mapper";
