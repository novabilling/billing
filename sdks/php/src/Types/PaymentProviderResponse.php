<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class PaymentProviderResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $providerName
     */
    #[JsonProperty('providerName')]
    public string $providerName;

    /**
     * @var bool $isActive
     */
    #[JsonProperty('isActive')]
    public bool $isActive;

    /**
     * @var float $priority
     */
    #[JsonProperty('priority')]
    public float $priority;

    /**
     * @var string $createdAt
     */
    #[JsonProperty('createdAt')]
    public string $createdAt;

    /**
     * @var string $updatedAt
     */
    #[JsonProperty('updatedAt')]
    public string $updatedAt;

    /**
     * @param array{
     *   id: string,
     *   providerName: string,
     *   isActive: bool,
     *   priority: float,
     *   createdAt: string,
     *   updatedAt: string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->providerName = $values['providerName'];
        $this->isActive = $values['isActive'];
        $this->priority = $values['priority'];
        $this->createdAt = $values['createdAt'];
        $this->updatedAt = $values['updatedAt'];
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->toJson();
    }
}
