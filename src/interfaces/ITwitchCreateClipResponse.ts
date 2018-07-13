/**
 * Represents the response structure of creating a clip programmatically
 *
 * @export
 * @interface ITwitchCreateClipResponse
 */
export interface ITwitchCreateClipResponse {
    data: [
        {
            id: string;
            edit_url: string;
        }
    ];
}
