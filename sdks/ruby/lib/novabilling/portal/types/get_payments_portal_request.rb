# frozen_string_literal: true

module Novabilling
  module Portal
    module Types
      class GetPaymentsPortalRequest < Internal::Types::Model
        field :external_id, -> { String }, optional: false, nullable: false, api_name: "externalId"
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
