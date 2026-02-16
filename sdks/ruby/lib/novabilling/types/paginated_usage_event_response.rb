# frozen_string_literal: true

module Novabilling
  module Types
    class PaginatedUsageEventResponse < Internal::Types::Model
      field :data, -> { Internal::Types::Array[Novabilling::Types::UsageEventResponse] }, optional: false, nullable: false
      field :meta, -> { Novabilling::Types::PaginationMeta }, optional: false, nullable: false
    end
  end
end
