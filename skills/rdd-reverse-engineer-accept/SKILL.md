---
name: rdd-reverse-engineer-accept
description: Review and apply one human decision accepting an exact verified and delivered reverse-engineered PENDING_VERIFICATION baseline. Use only with an eligible current as-built proof packet; preserves compliance approval and normal development gates.
---

# Accept verified existing behavior

Read PROCESS.md's "As-built verification and acceptance" and the consuming project's sanctioned CLI procedure. This path uses one reviewed human acceptance decision, not normal development entry/completion gates.

1. Read the retained verification packet and preview it again. Require complete applicable SR lower and independent UR upper proof plus the separate current per-repository integration observations. Already DONE required SRs remain independently verified proof dependencies and are not reaccepted or transitioned. A gap, changed pin or unmerged revision returns to rdd-reverse-engineer-verify.
2. Open the dedicated acceptance decision using its exact scope, proof digest, stable retry key and human brief. Show what becomes DONE, the evidence identities and coverage limits, the risk of accepting incorrect proof and the recommendation. Compliance draft/approved state is unchanged. Opening the gate is not a human answer.
3. Obtain one explicit attributable human accept/reject decision for that exact packet. Prior permission to reverse-engineer or implement tooling is not acceptance of the baseline. Submit the reviewed answer through the existing answer mechanism, pinned to both the current gate and proof fingerprints with the USER source. The server rechecks the retained proof here.
4. Apply an approved answer using the dedicated guarded operation, exact fingerprints and stable retry key. The server rechecks all proof and atomically moves exactly the named PENDING_VERIFICATION requirements to DONE, records lifecycle events, closes the applied decision and retains the receipt. Rejection grants no promotion. Never advance through generic author or fabricate RED.
5. Read the application receipt and each named lifecycle/compliance state. A recorded answer without an applied receipt is still pending application. After interruption, read status first, then retry identical input only; changed input conflicts and requires fresh review. Historical receipts remain readable after later drift, but stale proof cannot be replayed as current acceptance.

Report the human answer, recorded/applied state, receipt identity, exact named scope and unchanged compliance status. Stop at the phase report unless the user already requested the complete loop. Merge, publishing and deployment require their own authority.
