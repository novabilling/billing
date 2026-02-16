# frozen_string_literal: true

module Novabilling
  module Tenants
    module Types
      class TestSMTPTenantsRequest < Internal::Types::Model
        field :to, -> { String }, optional: false, nullable: false
      end
    end
  end
end
