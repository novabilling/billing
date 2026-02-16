<?php

namespace NovaBilling\Subscriptions\Requests;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Subscriptions\Types\CancelSubscriptionDtoCancelAt;
use NovaBilling\Core\Json\JsonProperty;

class CancelSubscriptionDto extends JsonSerializableType
{
    /**
     * @var value-of<CancelSubscriptionDtoCancelAt> $cancelAt When to cancel: immediately or at end of current period
     */
    #[JsonProperty('cancelAt')]
    public string $cancelAt;

    /**
     * @param array{
     *   cancelAt: value-of<CancelSubscriptionDtoCancelAt>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->cancelAt = $values['cancelAt'];
    }
}
