import type { PostFormValues } from "./validation";

/**
 * The post as it is sent to the create/update Server Actions.
 *
 * ProseMirror builds every mark and node `attrs` object with a null prototype
 * (`link.attrs`, `heading.attrs`, `image.attrs`, …), and React's action
 * transport doesn't serialise those: it swaps them for opaque "temporary client
 * references" that the server can neither read nor store. A link therefore
 * arrived as `{"type":"link"}` with its `href` gone — saved, but an `<a>` with
 * no address, so it was neither blue nor clickable after reopening or publishing.
 * A JSON round trip leaves plain objects, which cross the transport intact.
 */
export function toActionPayload(values: PostFormValues, status: PostFormValues["status"]): PostFormValues {
  return { ...values, status, content: JSON.parse(JSON.stringify(values.content)) };
}
