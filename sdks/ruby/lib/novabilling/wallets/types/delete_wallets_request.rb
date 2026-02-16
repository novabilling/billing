# frozen_string_literal: true

module Novabilling
  module Wallets
    module Types
      class DeleteWalletsRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
