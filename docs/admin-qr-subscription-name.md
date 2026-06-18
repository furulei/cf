# Admin QR Subscription Name

The admin QR panel appends the subscription display name to generated subscription URLs as a URL fragment.

Example:

```text
https://a.ip168.dpdns.org/sub?token=<redacted>&b64=1#少年
```

The fragment is used by scan clients such as Clash to prefill the local remark/name. It is not sent to the server and does not affect subscription conversion.

When the token, subscription name, or link format changes, the currently displayed QR code is regenerated for the same link format so the visible QR stays in sync with the current form value.
