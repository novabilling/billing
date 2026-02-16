<?php

namespace NovaBilling\Types;

use NovaBilling\Core\Json\JsonSerializableType;
use NovaBilling\Core\Json\JsonProperty;

class TaxResponse extends JsonSerializableType
{
    /**
     * @var string $id
     */
    #[JsonProperty('id')]
    public string $id;

    /**
     * @var string $name
     */
    #[JsonProperty('name')]
    public string $name;

    /**
     * @var string $code
     */
    #[JsonProperty('code')]
    public string $code;

    /**
     * @var string $rate
     */
    #[JsonProperty('rate')]
    public string $rate;

    /**
     * @var ?string $description
     */
    #[JsonProperty('description')]
    public ?string $description;

    /**
     * @var bool $appliedByDefault
     */
    #[JsonProperty('appliedByDefault')]
    public bool $appliedByDefault;

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
     *   name: string,
     *   code: string,
     *   rate: string,
     *   appliedByDefault: bool,
     *   createdAt: string,
     *   updatedAt: string,
     *   description?: ?string,
     * } $values
     */
    public function __construct(
        array $values,
    ) {
        $this->id = $values['id'];
        $this->name = $values['name'];
        $this->code = $values['code'];
        $this->rate = $values['rate'];
        $this->description = $values['description'] ?? null;
        $this->appliedByDefault = $values['appliedByDefault'];
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
