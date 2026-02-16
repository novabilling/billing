# frozen_string_literal: true

module Novabilling
  module Types
    class PaginatedWalletResponse < Internal::Types::Model
      field :data, -> { Internal::Types::Array[Novabilling::Types::WalletResponse] }, optional: false, nullable: false
      field :meta, -> { Novabilling::Types::PaginationMeta }, optional: false, nullable: false
    end
  end
end
