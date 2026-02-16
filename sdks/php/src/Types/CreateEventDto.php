<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;
use NovaBilling\Core\Types\ArrayType;

class CreateEventDto extends JsonSerializableType
{
    /**
     * @var string $transactionId Unique transaction ID for idempotency
     */
    #[JsonProperty('transactionId')]
    public string $transactionId;

    /**
     * @var string $subscriptionId Subscription ID or external subscription ID
     */
    #[JsonProperty('subscriptionId')]
    public string $subscriptionId;

    /**
     * @var string $code Billable metric code
     */
    #[JsonProperty('code')]
    public string $code;

    /**
     * @var ?string $timestamp Event timestamp (defaults to now)
     */
    #[JsonProperty('timestamp')]
    public ?string $timestamp;

    /**
     * @var ?array<string, mixed> $properties Event properties
     */
    #[JsonProperty('properties'), ArrayType(['string' => 'mixed'])]
    public ?array $properties;

    /**
     * @param array{
     *   transactionId: string,
     *   subscriptionId: string,
     *   code: string,
     *   timestamp?: ?string,
     *   properties?: ?array<string, mixed>,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->transactionId = $values['transactionId'];
        $this->subscriptionId = $values['subscriptionId'];
        $this->code = $values['code'];
        $this->timestamp = $values['timestamp'] ?? null;
        $this->properties = $values['properties'] ?? null;
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
